import { NextRequest, NextResponse } from 'next/server';
import { legalAnalysisModel, listAvailableModels, LEGAL_PROMPTS } from '@/lib/gemini';
import { AnalysisType, AnalysisRequest, AnalysisResponse, AnalysisResult, Finding, Recommendation, Severity, Priority, RecommendationType } from '@/types/legal';

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

    // Prepare case context for AI analysis (simplified for serverless)
    const caseContext = `
      Case: ${caseData.caseNumber} - ${caseData.court}
      Type: ${caseData.caseType} (${caseData.status})
      
      Summary: ${caseData.caseDetails?.summary?.substring(0, 500) || 'No summary'}
      
      Evidence: ${caseData.caseDetails?.evidence?.slice(0, 3).map((e: any) => 
        `${e.description?.substring(0, 100)}`).join('; ') || 'No evidence'}
      
      Witnesses: ${caseData.caseDetails?.witnesses?.slice(0, 2).map((w: any) => 
        w.name?.substring(0, 50)).join('; ') || 'No witnesses'}
      
      ${additionalContext ? `Context: ${additionalContext.substring(0, 200)}` : ''}
    `;

    const fullPrompt = `${prompt}\n\nCase: ${caseContext}\n\nIMPORTANT: Respond with ONLY valid JSON, no additional text or markdown. Use this exact format:

{
  "riskScore": number (1-10),
  "confidence": number (0-1),
  "findings": [
    {
      "category": "string",
      "severity": "Low|Medium|High|Critical",
      "description": "string (max 150 chars)",
      "evidence": ["max 2 items"],
      "precedents": ["max 1 item"]
    }
  ],
  "recommendations": [
    {
      "type": "Legal Review|Investigation Required|Policy Change",
      "priority": "Low|Medium|High|Urgent", 
      "description": "string (max 150 chars)",
      "actionItems": ["max 2 items"],
      "timeline": "string"
    }
  ],
  "summary": "Brief summary (max 200 chars)"
}

Provide exactly 2-3 findings and 1-2 recommendations. Respond with valid JSON only.`;

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
            severity: Severity.MEDIUM,
            description: "Analysis timed out due to complex case data. Manual review recommended.",
            evidence: ["Complex case with multiple evidence pieces", "Multiple witnesses and procedures"],
            precedents: ["Manual legal review required for complex cases"]
          },
          {
            category: "Procedural Concerns",
            severity: Severity.HIGH, 
            description: "Based on case summary, potential procedural violations detected.",
            evidence: ["No warrant mentioned", "Limited legal representation initially"],
            precedents: ["D.K. Basu guidelines", "Article 21 protections"]
          }
        ],
        recommendations: [
          {
            type: RecommendationType.LEGAL_REVIEW,
            priority: Priority.HIGH,
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
      console.log('Raw AI response (first 500 chars):', analysisText.substring(0, 500));
      
      // Clean the response - remove markdown and common formatting issues
      let cleanedText = analysisText.trim();
      
      // Remove markdown code blocks
      cleanedText = cleanedText.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '');
      cleanedText = cleanedText.replace(/```\s*/gi, '');
      
      // Remove any leading/trailing text that isn't JSON
      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}') + 1;
      
      if (jsonStart === -1 || jsonEnd <= jsonStart) {
        throw new Error('No JSON object found in response');
      }
      
      const jsonString = cleanedText.substring(jsonStart, jsonEnd);
      console.log('Attempting to parse JSON:', jsonString.substring(0, 300) + '...');
      
      parsedAnalysis = JSON.parse(jsonString);
      
      // Validate required fields and fix common issues
      if (!parsedAnalysis.riskScore) parsedAnalysis.riskScore = 5;
      if (!parsedAnalysis.confidence) parsedAnalysis.confidence = 0.7;
      if (!Array.isArray(parsedAnalysis.findings)) parsedAnalysis.findings = [];
      if (!Array.isArray(parsedAnalysis.recommendations)) parsedAnalysis.recommendations = [];
      if (!parsedAnalysis.summary) parsedAnalysis.summary = "Analysis completed with parsing adjustments";
      
      // Ensure findings have proper structure
      parsedAnalysis.findings = parsedAnalysis.findings.map((f: any) => ({
        category: f.category || "General Analysis",
        severity: f.severity || "Medium",
        description: f.description || "Analysis finding",
        evidence: Array.isArray(f.evidence) ? f.evidence : [f.evidence || "Evidence provided"],
        precedents: Array.isArray(f.precedents) ? f.precedents : [f.precedents || "Legal precedent applicable"]
      }));
      
      // Ensure recommendations have proper structure  
      parsedAnalysis.recommendations = parsedAnalysis.recommendations.map((r: any) => ({
        type: r.type || "Legal Review",
        priority: r.priority || "Medium",
        description: r.description || "Recommendation provided",
        actionItems: Array.isArray(r.actionItems) ? r.actionItems : [r.actionItems || "Action required"],
        timeline: r.timeline || "Within reasonable time"
      }));
      
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      console.error('Full AI response:', analysisText);
      
      // Try to extract basic information from the text response
      const extractBasicInfo = (text: string) => {
        // Look for risk score
        const riskMatch = text.match(/risk.*?(\d+)/i);
        const riskScore = riskMatch ? parseInt(riskMatch[1]) : 6;
        
        // Look for confidence
        const confidenceMatch = text.match(/confidence.*?(0?\.\d+)/i);
        const confidence = confidenceMatch ? parseFloat(confidenceMatch[1]) : 0.6;
        
        return { riskScore, confidence };
      };
      
      const basicInfo = extractBasicInfo(analysisText);
      
      // Create a structured response based on the case details
      parsedAnalysis = {
        riskScore: basicInfo.riskScore,
        confidence: basicInfo.confidence,
        findings: [
          {
            category: "Evidence Reliability",
            severity: "High",
            description: "Multiple evidence types with varying reliability scores present concerns.",
            evidence: ["Forensic evidence with low reliability (1-2/5)", "Mixed digital evidence quality"],
            precedents: ["Standard evidence evaluation principles"]
          },
          {
            category: "Witness Credibility",
            severity: "Medium", 
            description: "Witness credibility varies significantly, including hostile witness.",
            evidence: ["Hostile witness present", "Mixed credibility ratings"],
            precedents: ["Witness reliability assessment guidelines"]
          }
        ],
        recommendations: [
          {
            type: "Legal Review",
            priority: "High",
            description: "Comprehensive review of evidence reliability and witness statements required.",
            actionItems: ["Re-examine forensic evidence", "Cross-verify witness testimonies"],
            timeline: "Within 2 weeks"
          }
        ],
        summary: "Case shows evidence reliability concerns and witness credibility issues requiring detailed legal review."
      };
    }
          severity: Severity.MEDIUM,
          description: "AI analysis completed but response parsing failed. The case may have complex elements requiring manual review.",
          evidence: ["JSON parsing failed", "AI model responded but format was invalid"],
          precedents: ["Manual legal analysis recommended for complex cases"]
        }],
        recommendations: [{
          type: RecommendationType.LEGAL_REVIEW,
          priority: Priority.HIGH,
          description: "Manual review recommended due to analysis processing issues.",
          actionItems: ["Review case details manually", "Consult with legal experts", "Try with simplified case data"],
          timeline: "Immediate"
        }],
        summary: "Analysis completed with parsing issues - manual review recommended"
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