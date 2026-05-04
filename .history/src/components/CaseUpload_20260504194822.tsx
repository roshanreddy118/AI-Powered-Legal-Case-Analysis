'use client';

import { useState } from 'react';
import { AnalysisType, CourtType, CaseType, IndianState } from '@/types/legal';
import { Upload, FileText, AlertCircle, Loader2 } from 'lucide-react';

interface CaseUploadProps {
  onAnalysisComplete: (result: any) => void;
}

export default function CaseUpload({ onAnalysisComplete }: CaseUploadProps) {
  const [formData, setFormData] = useState({
    caseNumber: '',
    title: '',
    court: CourtType.HIGH_COURT,
    state: IndianState.DELHI,
    caseType: CaseType.CRIMINAL,
    summary: '',
    charges: '',
    evidence: '',
    witnesses: '',
    proceduresFollowed: '',
    additionalContext: ''
  });

  const [analysisType, setAnalysisType] = useState<AnalysisType>(AnalysisType.WRONGFUL_CONVICTION);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setError(null);

    try {
      // Prepare case data for analysis
      const caseData = {
        caseNumber: formData.caseNumber,
        title: formData.title,
        court: formData.court,
        state: formData.state,
        caseType: formData.caseType,
        status: 'Under Review',
        parties: [
          { type: 'Accused', name: 'Sample Accused' },
          { type: 'Complainant', name: 'Sample Complainant' }
        ],
        caseDetails: {
          summary: formData.summary,
          charges: formData.charges.split('\n').filter(c => c.trim()),
          sections: [
            { act: 'IPC', section: '302', description: 'Murder' }
          ],
          evidence: formData.evidence.split('\n').filter(e => e.trim()).map(e => ({
            type: 'Documentary',
            description: e,
            reliability: 3
          })),
          witnesses: formData.witnesses.split('\n').filter(w => w.trim()).map(w => ({
            type: 'Eye Witness',
            name: w,
            credibility: 3
          })),
          proceduresFollowed: formData.proceduresFollowed.split('\n').filter(p => p.trim())
        },
        timeline: [
          { date: new Date().toISOString(), description: 'Case filed for analysis' }
        ]
      };

      // Call analysis API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseId: `case_${Date.now()}`,
          analysisType,
          additionalContext: formData.additionalContext,
          caseData
        }),
      });

      const result = await response.json();

      if (result.success) {
        onAnalysisComplete(result.data);
      } else {
        setError(result.error || 'Analysis failed');
      }
    } catch (err) {
      setError('Failed to analyze case. Please try again.');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-xl rounded-3xl border border-purple-500/20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            Legal Case Analysis
          </span>
        </h2>
        <p className="text-white/70 text-lg leading-relaxed">
          Enter case details below to perform AI-powered analysis for potential issues and patterns.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Case Basic Information */}
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <FileText className="h-6 w-6 text-cyan-400 mr-2 drop-shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
            Case Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2 drop-shadow-sm">
                Case Number *
              </label>
              <input
                type="text"
                name="caseNumber"
                value={formData.caseNumber}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-white placeholder-white/50 transition-all duration-300 hover:border-white/30"
                placeholder="e.g., Crl.A. 123/2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2 drop-shadow-sm">
                Case Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-white placeholder-white/50 transition-all duration-300 hover:border-white/30"
                placeholder="e.g., State vs. John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2 drop-shadow-sm">
                Court Type *
              </label>
              <select
                name="court"
                value={formData.court}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-white transition-all duration-300 hover:border-white/30"
              >
                {Object.values(CourtType).map(court => (
                  <option key={court} value={court}>{court}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2 drop-shadow-sm">
                State *
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-white transition-all duration-300 hover:border-white/30"
              >
                {Object.values(IndianState).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2 drop-shadow-sm">
                Case Type *
              </label>
              <select
                name="caseType"
                value={formData.caseType}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-white transition-all duration-300 hover:border-white/30"
              >
                {Object.values(CaseType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-cyan-300 mb-2 drop-shadow-sm">
                Analysis Type *
              </label>
              <select
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value as AnalysisType)}
                required
                className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 text-white transition-all duration-300 hover:border-white/30"
              >
                {Object.values(AnalysisType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Case Details */}
        <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-500 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <AlertCircle className="h-6 w-6 text-purple-400 mr-2 drop-shadow-[0_0_10px_rgba(168,85,247,0.7)]" />
            Case Details
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2 drop-shadow-sm">
                Case Summary *
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 text-white placeholder-white/50 transition-all duration-300 hover:border-white/30 resize-none"
                placeholder="Provide a detailed summary of the case..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2 drop-shadow-sm">
                Charges/Sections (one per line)
              </label>
              <textarea
                name="charges"
                value={formData.charges}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 text-white placeholder-white/50 transition-all duration-300 hover:border-white/30 resize-none"
                placeholder="IPC Section 302 - Murder&#10;IPC Section 201 - Destruction of Evidence"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2 drop-shadow-sm">
                Evidence Details (one per line)
              </label>
              <textarea
                name="evidence"
                value={formData.evidence}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 text-white placeholder-white/50 transition-all duration-300 hover:border-white/30 resize-none"
                placeholder="Fingerprints found at scene&#10;CCTV footage from nearby shop&#10;Witness testimony of John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2 drop-shadow-sm">
                Witnesses (one per line)
              </label>
              <textarea
                name="witnesses"
                value={formData.witnesses}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 text-white placeholder-white/50 transition-all duration-300 hover:border-white/30 resize-none"
                placeholder="John Smith - Eye witness&#10;Dr. Jane Doe - Medical examiner&#10;Inspector Ram Kumar - Investigating officer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2 drop-shadow-sm">
                Procedures Followed (one per line)
              </label>
              <textarea
                name="proceduresFollowed"
                value={formData.proceduresFollowed}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 text-white placeholder-white/50 transition-all duration-300 hover:border-white/30 resize-none"
                placeholder="FIR registered within 24 hours&#10;Accused arrested with warrant&#10;Miranda rights read before questioning"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2 drop-shadow-sm">
                Additional Context
              </label>
              <textarea
                name="additionalContext"
                value={formData.additionalContext}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 bg-black/40 backdrop-blur-sm border border-white/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 text-white placeholder-white/50 transition-all duration-300 hover:border-white/30 resize-none"
                placeholder="Any additional information relevant to the analysis..."
              />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/30 backdrop-blur-xl border border-red-500/30 rounded-xl p-4 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)] transition-all duration-300">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-3 drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]" />
              <div className="text-sm text-red-300">{error}</div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isAnalyzing}
            className="group relative bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white px-8 py-4 rounded-xl font-medium flex items-center space-x-3 transition-all duration-500 transform hover:scale-105 hover:shadow-[0_0_40px_rgba(34,211,238,0.4)] disabled:scale-100 disabled:shadow-none disabled:cursor-not-allowed"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-700 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative flex items-center space-x-3">
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                  <span className="text-lg">Analyzing Case...</span>
                </>
              ) : (
                <>
                  <FileText className="h-6 w-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                  <span className="text-lg">Analyze Case</span>
                </>
              )}
            </div>
          </button>
        </div>
      </form>
    </div>
  );
}