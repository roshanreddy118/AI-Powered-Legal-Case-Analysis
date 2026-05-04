import { NextRequest, NextResponse } from 'next/server';
import { legalAnalysisModel, LEGAL_PROMPTS } from '@/lib/gemini';
import { AnalysisType, AnalysisRequest, AnalysisResponse, AnalysisResult, Finding, Recommendation } from '@/types/legal';

export async function POST(request: NextRequest) {
  try {
    const { caseId, analysisType, additionalContext, caseData } = await request.json() as AnalysisRequest & { caseData: any };

    if (!caseId || !analysisType || !caseData) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: caseId, analysisType, and caseData'
      }, { status: 400 });
    }

    const startTime = Date.now();

    // Select appropriate prompt based on analysis type
    let prompt = '';
    switch (analysisType) {
      case AnalysisType.WRONGFUL_CONVICTION:
        prompt = LEGAL_PROMPTS.WRONGFUL_CONVICTION_ANALYSIS;
        break;
      case AnalysisType.PROSECUTORIAL_MISCONDUCT:
        prompt = LEGAL_PROMPTS.PROSECUTORIAL_MISCONDUCT;
        break;
      case AnalysisType.CASE_SIMILARITY:
        prompt = LEGAL_PROMPTS.CASE_SIMILARITY_ANALYSIS;
        break;
      case AnalysisType.BIAS_DETECTION:
        prompt = LEGAL_PROMPTS.BIAS_DETECTION;
        break;
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid analysis type'
        }, { status: 400 });
    }

    // Prepare case context for AI analysis
    const caseContext = `
      Case Details:
      Case Number: ${caseData.caseNumber}
      Court: ${caseData.court}
      Case Type: ${caseData.caseType}
      Status: ${caseData.status}
      
      Parties Involved:
      ${caseData.parties?.map((p: any) => `${p.type}: ${p.name}`).join('\n')}
      
      Legal Sections:
      ${caseData.caseDetails?.sections?.map((s: any) => `${s.act} Section ${s.section}: ${s.description}`).join('\n')}
      
      Evidence:
      ${caseData.caseDetails?.evidence?.map((e: any) => `${e.type}: ${e.description} (Reliability: ${e.reliability}/5)`).join('\n')}
      
      Witnesses:
      ${caseData.caseDetails?.witnesses?.map((w: any) => `${w.type}: ${w.name} (Credibility: ${w.credibility}/5)`).join('\n')}
      
      Case Summary:
      ${caseData.caseDetails?.summary}
      
      Timeline:
      ${caseData.timeline?.map((t: any) => `${t.date}: ${t.description}`).join('\n')}
      
      ${additionalContext ? `Additional Context: ${additionalContext}` : ''}
    `;

    const fullPrompt = `${prompt}\n\nCase Information:\n${caseContext}\n\nPlease provide your analysis in the following JSON format:
    {
      "riskScore": number (1-10),
      "confidence": number (0-1),
      "findings": [
        {
          "category": "string",
          "severity": "Low" | "Medium" | "High" | "Critical",
          "description": "string",
          "evidence": ["string array"],
          "precedents": ["string array (optional)"]
        }
      ],
      "recommendations": [
        {
          "type": "Investigation Required" | "Legal Review" | "Policy Change" | "Training Required" | "Escalate to Higher Authority" | "No Action Required",
          "priority": "Low" | "Medium" | "High" | "Urgent",
          "description": "string",
          "actionItems": ["string array"],
          "timeline": "string (optional)"
        }
      ],
      "summary": "Overall analysis summary"
    }`;

    // Get AI analysis
    const result = await legalAnalysisModel.generateContent(fullPrompt);
    const response = await result.response;
    const analysisText = response.text();

    // Parse AI response
    let parsedAnalysis;
    try {
      // Extract JSON from response (AI might include additional text)
      const jsonStart = analysisText.indexOf('{');
      const jsonEnd = analysisText.lastIndexOf('}') + 1;
      const jsonString = analysisText.substring(jsonStart, jsonEnd);
      parsedAnalysis = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return NextResponse.json({
        success: false,
        error: 'Failed to parse AI analysis response'
      }, { status: 500 });
    }

    // Create analysis result
    const analysisResult: AnalysisResult = {
      id: generateId(),
      caseId,
      analysisType,
      riskScore: parsedAnalysis.riskScore || 0,
      confidence: parsedAnalysis.confidence || 0,
      findings: parsedAnalysis.findings || [],
      recommendations: parsedAnalysis.recommendations || [],
      aiModel: 'gemini-1.5-pro',
      analysisDate: new Date(),
    };

    const processingTime = Date.now() - startTime;

    // TODO: Save to database here
    // await saveAnalysisResult(analysisResult);

    const response_data: AnalysisResponse = {
      success: true,
      data: analysisResult,
      processingTime
    };

    return NextResponse.json(response_data);

  } catch (error) {
    console.error('Analysis error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error during analysis'
    }, { status: 500 });
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}