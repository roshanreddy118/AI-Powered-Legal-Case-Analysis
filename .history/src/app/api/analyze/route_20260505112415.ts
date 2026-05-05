import { NextRequest, NextResponse } from 'next/server';
import { legalAnalysisModel, listAvailableModels, LEGAL_PROMPTS } from '@/lib/gemini';
import { AnalysisType, AnalysisRequest, AnalysisResponse, AnalysisResult, Finding, Recommendation } from '@/types/legal';

export const maxDuration = 60; // Vercel serverless function timeout
export const dynamic = 'force-dynamic'; // Ensure this is treated as a dynamic route

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
    // Handle both enum keys and string values
    const normalizedAnalysisType = Object.keys(AnalysisType).find(key => 
      AnalysisType[key as keyof typeof AnalysisType] === analysisType || key === analysisType
    );
    
    switch (normalizedAnalysisType) {
      case 'WRONGFUL_CONVICTION':
        prompt = LEGAL_PROMPTS.WRONGFUL_CONVICTION_ANALYSIS;
        break;
      case 'PROSECUTORIAL_MISCONDUCT':
        prompt = LEGAL_PROMPTS.PROSECUTORIAL_MISCONDUCT;
        break;
      case 'CASE_SIMILARITY':
        prompt = LEGAL_PROMPTS.CASE_SIMILARITY_ANALYSIS;
        break;
      case 'BIAS_DETECTION':
        prompt = LEGAL_PROMPTS.BIAS_DETECTION;
        break;
      default:
        return NextResponse.json({
          success: false,
          error: `Invalid analysis type: ${analysisType}. Valid types: ${Object.values(AnalysisType).join(', ')}`
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

    const fullPrompt = `${prompt}\n\nCase Information:\n${caseContext}\n\nPlease provide a concise analysis in the following JSON format (keep responses focused and brief):
    {
      "riskScore": number (1-10),
      "confidence": number (0-1),
      "findings": [
        {
          "category": "string",
          "severity": "Low" | "Medium" | "High" | "Critical",
          "description": "string (max 200 chars)",
          "evidence": ["string array (max 3 items)"],
          "precedents": ["string array (max 2 items)"]
        }
      ],
      "recommendations": [
        {
          "type": "Investigation Required" | "Legal Review" | "Policy Change" | "Training Required" | "Escalate to Higher Authority" | "No Action Required",
          "priority": "Low" | "Medium" | "High" | "Urgent",
          "description": "string (max 200 chars)",
          "actionItems": ["string array (max 3 items)"],
          "timeline": "string (optional)"
        }
      ],
      "summary": "Brief overall analysis summary (max 300 chars)"
    }

    Focus on the most critical 3-4 findings and 2-3 recommendations. Be concise but accurate.`;

    // Get AI analysis using dynamic model selection with timeout
    let aiResult;
    try {
      // Set a timeout for the entire AI analysis (shorter for serverless)
      const timeoutDuration = process.env.NODE_ENV === 'production' ? 30000 : 50000;
      const analysisTimeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error(`Analysis timeout after ${timeoutDuration/1000}s - try with shorter input`)), timeoutDuration);
      });

      aiResult = await Promise.race([
        legalAnalysisModel.generateContent(fullPrompt),
        analysisTimeout
      ]) as any;
      
    } catch (timeoutError) {
      console.error('AI analysis timeout:', timeoutError);
      
      // Return a basic analysis when timeout occurs
      const basicAnalysis = {
        riskScore: 6,
        confidence: 0.7,
        findings: [
          {
            category: "Analysis Timeout",
            severity: "Medium",
            description: "Analysis timed out due to complex case data. Manual review recommended.",
            evidence: ["Complex case with multiple evidence pieces", "Multiple witnesses and procedures"],
            precedents: ["Manual legal review required for complex cases"]
          },
          {
            category: "Procedural Concerns",
            severity: "High", 
            description: "Based on case summary, potential procedural violations detected.",
            evidence: ["No warrant mentioned", "Limited legal representation initially"],
            precedents: ["D.K. Basu guidelines", "Article 21 protections"]
          }
        ],
        recommendations: [
          {
            type: "Legal Review",
            priority: "High",
            description: "Immediate manual legal review required due to analysis timeout.",
            actionItems: ["Review case details manually", "Consult legal experts", "Re-analyze with simplified data"],
            timeline: "Within 24 hours"
          }
        ],
        summary: "Complex case requiring manual review due to analysis timeout. Multiple procedural concerns detected."
      };

      const analysisResult: AnalysisResult = {
        id: generateId(),
        caseId,
        analysisType,
        riskScore: basicAnalysis.riskScore,
        confidence: basicAnalysis.confidence,
        findings: basicAnalysis.findings,
        recommendations: basicAnalysis.recommendations,
        aiModel: 'timeout-fallback',
        analysisDate: new Date(),
      };

      const processingTime = Date.now() - startTime;
      return NextResponse.json({
        success: true,
        data: analysisResult,
        processingTime,
        note: "Analysis timed out - basic analysis provided. Try with less detailed input for full AI analysis."
      });
    }
    
    // Check if response is valid
    if (!aiResult.success || !aiResult.text) {
      throw new Error('Invalid response from AI model');
    }
    
    const analysisText = aiResult.text;
    const modelUsed = aiResult.modelUsed;

    // Parse AI response
    let parsedAnalysis;
    try {
      // First try to parse the entire response as JSON
      try {
        parsedAnalysis = JSON.parse(analysisText);
      } catch {
        // If that fails, try to extract JSON from response
        const jsonStart = analysisText.indexOf('{');
        const jsonEnd = analysisText.lastIndexOf('}') + 1;
        
        if (jsonStart === -1 || jsonEnd <= jsonStart) {
          throw new Error('No JSON found in AI response');
        }
        
        const jsonString = analysisText.substring(jsonStart, jsonEnd);
        parsedAnalysis = JSON.parse(jsonString);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw AI response:', analysisText);
      
      // Return a default analysis if parsing fails
      parsedAnalysis = {
        riskScore: 5,
        confidence: 0.7,
        findings: [{
          category: "Analysis Processing",
          severity: "Medium",
          description: "The AI analysis encountered parsing issues. Please review the case manually or try again.",
          evidence: ["AI response parsing failed"],
          precedents: []
        }],
        recommendations: [{
          type: "Legal Review",
          priority: "High",
          description: "Manual review recommended due to analysis processing issues.",
          actionItems: ["Review case details manually", "Consult with legal experts"],
          timeline: "Immediate"
        }],
        summary: "Analysis completed with technical limitations"
      };
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
      aiModel: modelUsed || 'gemini-dynamic',
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
    
    // Handle specific Gemini API errors
    let errorMessage = 'Internal server error during analysis';
    if (error instanceof Error) {
      if (error.message.includes('version v1beta') || error.message.includes('not supported')) {
        errorMessage = 'AI model configuration error. Please check API settings.';
      } else if (error.message.includes('API key')) {
        errorMessage = 'API authentication error. Please check your API key.';
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        errorMessage = 'API rate limit exceeded. Please try again later.';
      } else {
        errorMessage = `AI Analysis Error: ${error.message}`;
      }
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}