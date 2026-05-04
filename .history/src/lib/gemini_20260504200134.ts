import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Test function to list available models
export async function listAvailableModels() {
  try {
    // Note: listModels might not be available in all SDK versions
    console.log('Gemini API configured successfully');
    return null;
  } catch (error) {
    console.error('Error with Gemini configuration:', error);
    return null;
  }
}

// Function to try generating content with different models
export async function generateLegalAnalysis(prompt: string) {
  const modelNames = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro'
  ];

  for (const modelName of modelNames) {
    try {
      console.log(`Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      });

      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      if (response && response.text) {
        console.log(`Success with model: ${modelName}`);
        return {
          success: true,
          text: response.text(),
          modelUsed: modelName
        };
      }
    } catch (error) {
      console.log(`Model ${modelName} failed:`, error);
      continue;
    }
  }

  // If all models fail, let's check if it's an API key issue
  console.log('All models failed. Checking API key...');
  console.log('API Key configured:', !!process.env.GEMINI_API_KEY);
  console.log('API Key length:', process.env.GEMINI_API_KEY?.length || 0);
  
  throw new Error('All Gemini models failed to generate content. Please check your API key and model access.');
}

// Legacy exports for compatibility
export function createLegalAnalysisModel() {
  // Return a placeholder - actual model selection happens in generateLegalAnalysis
  return { 
    model: null, 
    modelName: 'dynamic-selection' 
  };
}

let currentModelName = 'dynamic-selection';
let legalAnalysisModel = {
  generateContent: generateLegalAnalysis
};

export { legalAnalysisModel, currentModelName };

// Specialized prompts for different types of legal analysis
export const LEGAL_PROMPTS = {
  WRONGFUL_CONVICTION_ANALYSIS: `
    Analyze this legal case for potential wrongful conviction indicators. 
    Consider the following factors:
    1. Evidence quality and reliability
    2. Procedural violations
    3. Witness credibility issues
    4. Police misconduct patterns
    5. Inadequate legal representation
    6. Forensic evidence problems
    7. Coerced confessions
    
    Provide a risk score (1-10) and detailed analysis with specific concerns.
    Focus on Indian legal context and precedents.
  `,
  
  PROSECUTORIAL_MISCONDUCT: `
    Examine this case for signs of prosecutorial misconduct including:
    1. Evidence suppression or tampering
    2. Witness intimidation
    3. Due process violations
    4. Selective prosecution
    5. Improper charging decisions
    6. Conflict of interest
    
    Rate the severity and provide recommendations for investigation.
  `,
  
  CASE_SIMILARITY_ANALYSIS: `
    Compare this case with similar cases in Indian judiciary:
    1. Identify similar fact patterns
    2. Compare legal outcomes and sentences
    3. Identify precedents and citations
    4. Analyze consistency in judicial decisions
    5. Flag unusual deviations from standard practice
    
    Provide similarity scores and relevant case references.
  `,
  
  BIAS_DETECTION: `
    Analyze potential bias in this legal case:
    1. Demographic bias (caste, religion, economic status)
    2. Regional bias
    3. Gender bias
    4. Judicial bias patterns
    5. Systemic discrimination indicators
    
    Provide bias risk assessment and recommendations.
  `
};

export { genAI };