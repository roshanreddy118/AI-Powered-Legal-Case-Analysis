'use client';

import { useState } from 'react';
import { AnalysisType } from '@/types/legal';
import CaseUpload from '@/components/CaseUpload';
import AnalysisResults from '@/components/AnalysisResults';
import { Scale, Shield, AlertTriangle, Users } from 'lucide-react';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'analysis'>('upload');
  const [analysisResult, setAnalysisResult] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Scale className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">LegalAI</h1>
                <p className="text-sm text-gray-600">Indian Judiciary Case Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Powered by Gemini AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Legal Case Analysis
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Identify potential wrongful convictions, prosecutorial misconduct, and ensure justice 
            through advanced AI analysis of Indian legal cases.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Wrongful Conviction Detection</h3>
            <p className="text-gray-600 text-sm">Analyze cases for potential wrongful conviction indicators</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Prosecutorial Misconduct</h3>
            <p className="text-gray-600 text-sm">Identify patterns of prosecutorial misconduct</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Scale className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Case Similarity Analysis</h3>
            <p className="text-gray-600 text-sm">Compare with similar cases across jurisdictions</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bias Detection</h3>
            <p className="text-gray-600 text-sm">Detect demographic and systemic bias patterns</p>
          </div>
        </div>

        {/* Main Analysis Interface */}
        <div className="bg-white rounded-lg shadow-lg">
          {currentStep === 'upload' ? (
            <CaseUpload 
              onAnalysisComplete={(result) => {
                setAnalysisResult(result);
                setCurrentStep('analysis');
              }}
            />
          ) : (
            <AnalysisResults 
              result={analysisResult}
              onNewAnalysis={() => {
                setCurrentStep('upload');
                setAnalysisResult(null);
              }}
            />
          )}
        </div>

        {/* Statistics Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Impact on Indian Justice System
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">40M+</div>
              <div className="text-gray-600">Pending Cases in India</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">3-15</div>
              <div className="text-gray-600">Years Average Case Duration</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">1.3M</div>
              <div className="text-gray-600">Registered Lawyers</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2026 LegalAI. Building AI solutions for justice and legal reform in India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
