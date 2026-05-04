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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-10 opacity-50">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
      </div>
      
      {/* Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-md shadow-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Scale className="h-8 w-8 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.7)]" />
                <div className="absolute inset-0 h-8 w-8 bg-cyan-400 rounded-full blur-md opacity-30 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">LegalAI</h1>
                <p className="text-sm text-cyan-300">Indian Judiciary Case Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-white/70 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full border border-white/10 backdrop-blur-sm">Powered by Gemini AI</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
              AI-Powered Legal
            </span>
            <br />
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Case Analysis
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
            Identify potential wrongful convictions, prosecutorial misconduct, and ensure justice 
            through advanced AI analysis of Indian legal cases.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group relative bg-gradient-to-br from-black/40 to-green-900/30 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-center border border-green-500/20 hover:border-green-400/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(34,197,94,0.3)] hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="relative mb-4">
                <Shield className="h-12 w-12 text-green-400 mx-auto drop-shadow-[0_0_15px_rgba(34,197,94,0.7)] group-hover:drop-shadow-[0_0_25px_rgba(34,197,94,0.9)] transition-all duration-500" />
                <div className="absolute inset-0 h-12 w-12 bg-green-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 mx-auto"></div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-green-300 transition-colors duration-300">Wrongful Conviction Detection</h3>
              <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors duration-300">Analyze cases for potential wrongful conviction indicators</p>
            </div>
          </div>
          
          <div className="group relative bg-gradient-to-br from-black/40 to-red-900/30 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-center border border-red-500/20 hover:border-red-400/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.3)] hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-rose-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="relative mb-4">
                <AlertTriangle className="h-12 w-12 text-red-400 mx-auto drop-shadow-[0_0_15px_rgba(239,68,68,0.7)] group-hover:drop-shadow-[0_0_25px_rgba(239,68,68,0.9)] transition-all duration-500" />
                <div className="absolute inset-0 h-12 w-12 bg-red-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 mx-auto"></div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-red-300 transition-colors duration-300">Prosecutorial Misconduct</h3>
              <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors duration-300">Identify patterns of prosecutorial misconduct</p>
            </div>
          </div>
          
          <div className="group relative bg-gradient-to-br from-black/40 to-blue-900/30 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-center border border-blue-500/20 hover:border-blue-400/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="relative mb-4">
                <Scale className="h-12 w-12 text-blue-400 mx-auto drop-shadow-[0_0_15px_rgba(59,130,246,0.7)] group-hover:drop-shadow-[0_0_25px_rgba(59,130,246,0.9)] transition-all duration-500" />
                <div className="absolute inset-0 h-12 w-12 bg-blue-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 mx-auto"></div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors duration-300">Case Similarity Analysis</h3>
              <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors duration-300">Compare with similar cases across jurisdictions</p>
            </div>
          </div>
          
          <div className="group relative bg-gradient-to-br from-black/40 to-purple-900/30 backdrop-blur-xl rounded-2xl shadow-2xl p-6 text-center border border-purple-500/20 hover:border-purple-400/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:-translate-y-2">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="relative mb-4">
                <Users className="h-12 w-12 text-purple-400 mx-auto drop-shadow-[0_0_15px_rgba(168,85,247,0.7)] group-hover:drop-shadow-[0_0_25px_rgba(168,85,247,0.9)] transition-all duration-500" />
                <div className="absolute inset-0 h-12 w-12 bg-purple-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500 mx-auto"></div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">Bias Detection</h3>
              <p className="text-white/70 text-sm group-hover:text-white/90 transition-colors duration-300">Detect demographic and systemic bias patterns</p>
            </div>
          </div>
        </div>

        {/* Main Analysis Interface */}
        <div className="bg-black/30 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 hover:shadow-[0_0_60px_rgba(147,51,234,0.3)] transition-all duration-700">
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
          <h3 className="text-3xl font-bold text-white text-center mb-8 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Impact on Indian Justice System
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center bg-gradient-to-br from-black/40 to-indigo-900/30 backdrop-blur-xl rounded-2xl p-8 border border-indigo-500/20 hover:border-indigo-400/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] hover:-translate-y-2">
              <div className="text-5xl font-bold text-indigo-400 mb-2 drop-shadow-[0_0_15px_rgba(99,102,241,0.7)] group-hover:drop-shadow-[0_0_25px_rgba(99,102,241,0.9)] transition-all duration-500">40M+</div>
              <div className="text-white/70 group-hover:text-white transition-colors duration-300">Pending Cases in India</div>
            </div>
            <div className="group text-center bg-gradient-to-br from-black/40 to-green-900/30 backdrop-blur-xl rounded-2xl p-8 border border-green-500/20 hover:border-green-400/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(34,197,94,0.3)] hover:-translate-y-2">
              <div className="text-5xl font-bold text-green-400 mb-2 drop-shadow-[0_0_15px_rgba(34,197,94,0.7)] group-hover:drop-shadow-[0_0_25px_rgba(34,197,94,0.9)] transition-all duration-500">3-15</div>
              <div className="text-white/70 group-hover:text-white transition-colors duration-300">Years Average Case Duration</div>
            </div>
            <div className="group text-center bg-gradient-to-br from-black/40 to-red-900/30 backdrop-blur-xl rounded-2xl p-8 border border-red-500/20 hover:border-red-400/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(239,68,68,0.3)] hover:-translate-y-2">
              <div className="text-5xl font-bold text-red-400 mb-2 drop-shadow-[0_0_15px_rgba(239,68,68,0.7)] group-hover:drop-shadow-[0_0_25px_rgba(239,68,68,0.9)] transition-all duration-500">1.3M</div>
              <div className="text-white/70 group-hover:text-white transition-colors duration-300">Registered Lawyers</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/20 backdrop-blur-md text-white py-8 mt-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-white/60 hover:text-white transition-colors duration-300">
              © 2026 <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent font-semibold">LegalAI</span>. Building AI solutions for justice and legal reform in India.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
