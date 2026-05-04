import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        error: 'GEMINI_API_KEY not configured',
      }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try different model names systematically
    const modelNamesToTry = [
      'gemini-pro',
      'gemini-1.5-pro',
      'gemini-1.5-flash',
      'models/gemini-pro',
      'models/gemini-1.5-pro', 
      'models/gemini-1.5-flash',
      'text-bison-001',
      'chat-bison-001',
      'gemini-1.0-pro-latest',
      'gemini-1.0-pro'
    ];

    const results = [];
    
    for (const modelName of modelNamesToTry) {
      try {
        console.log(`Testing model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        
        const result = await model.generateContent('Test message: respond with "OK"');
        const response = await result.response;
        
        results.push({
          modelName,
          success: true,
          response: response.text()
        });
        
        // If we found a working model, we can stop here
        break;
        
      } catch (error) {
        results.push({
          modelName,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      results,
      workingModel: results.find(r => r.success),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}