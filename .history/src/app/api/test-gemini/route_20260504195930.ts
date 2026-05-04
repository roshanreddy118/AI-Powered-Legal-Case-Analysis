import { NextRequest, NextResponse } from 'next/server';
import { listAvailableModels, createLegalAnalysisModel } from '@/lib/gemini';

export async function GET() {
  try {
    // Test listing available models
    const models = await listAvailableModels();
    
    // Test creating a model
    let modelTest;
    try {
      const { model, modelName } = createLegalAnalysisModel();
      modelTest = {
        success: true,
        modelName,
        message: 'Successfully created model'
      };
    } catch (error) {
      modelTest = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }

    return NextResponse.json({
      availableModels: models,
      modelTest,
      apiKeyConfigured: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Gemini test error:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
      apiKeyConfigured: !!process.env.GEMINI_API_KEY,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}