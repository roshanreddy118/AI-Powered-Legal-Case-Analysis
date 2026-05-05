import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        error: 'GEMINI_API_KEY not configured',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }

    console.log('Testing basic Gemini API with key:', process.env.GEMINI_API_KEY.substring(0, 10) + '...');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try different models
    const modelsToTry = [
      'gemini-pro',
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'models/gemini-pro',
      'models/gemini-1.5-flash'
    ];

    let lastError = '';
    
    for (const modelName of modelsToTry) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({
          model: modelName,
        });

        const result = await model.generateContent('Hello, respond with just "API Works"');
        const response = await result.response;
        
        return NextResponse.json({
          success: true,
          apiResponse: response.text(),
          model: modelName,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.log(`Model ${modelName} failed:`, error);
        lastError = error instanceof Error ? error.message : 'Unknown error';
        continue;
      }
    }

    // If we get here, all models failed
    return NextResponse.json({
      success: false,
      error: `All models failed. Last error: ${lastError}`,
      apiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
      timestamp: new Date().toISOString()
    }, { status: 500 });

  } catch (error) {
    console.error('Basic Gemini API test failed:', error);
    
    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage,
      apiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}