import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Test function to list available models
export async function listAvailableModels() {
  try {
    const models = await genAI.listModels();
    console.log('Available models:', models);
    return models;
  } catch (error) {
    console.error('Error listing models:', error);
    return null;
  }
}

// Try different model configurations
export function createLegalAnalysisModel() {
  const modelNames = [
    'gemini-1.5-flash',
    'gemini-1.5-pro', 
    'gemini-pro',
    'models/gemini-pro',
    'models/gemini-1.5-flash'
  ];

  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
      });
      console.log(`Successfully created model with: ${modelName}`);
      return { model, modelName };
    } catch (error) {
      console.log(`Failed to create model with ${modelName}:`, error);
      continue;
    }
  }
  
  throw new Error('No compatible Gemini models found');
}

// Model configuration for legal case analysis - using fallback approach
let legalAnalysisModel: any;
let currentModelName: string;

try {
  const { model, modelName } = createLegalAnalysisModel();
  legalAnalysisModel = model;
  currentModelName = modelName;
} catch (error) {
  console.error('Failed to initialize Gemini model:', error);
  throw error;
}

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