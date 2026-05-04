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
    <div className="p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Legal Case Analysis</h2>
        <p className="text-gray-600">
          Enter case details below to perform AI-powered analysis for potential issues and patterns.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Case Basic Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Number *
              </label>
              <input
                type="text"
                name="caseNumber"
                value={formData.caseNumber}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Crl.A. 123/2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., State vs. John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Court Type *
              </label>
              <select
                name="court"
                value={formData.court}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Object.values(CourtType).map(court => (
                  <option key={court} value={court}>{court}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Object.values(IndianState).map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Type *
              </label>
              <select
                name="caseType"
                value={formData.caseType}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Object.values(CaseType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Analysis Type *
              </label>
              <select
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value as AnalysisType)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Object.values(AnalysisType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Case Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Case Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Case Summary *
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Provide a detailed summary of the case..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Charges/Sections (one per line)
              </label>
              <textarea
                name="charges"
                value={formData.charges}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="IPC Section 302 - Murder&#10;IPC Section 201 - Destruction of Evidence"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Evidence Details (one per line)
              </label>
              <textarea
                name="evidence"
                value={formData.evidence}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Fingerprints found at scene&#10;CCTV footage from nearby shop&#10;Witness testimony of John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Witnesses (one per line)
              </label>
              <textarea
                name="witnesses"
                value={formData.witnesses}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="John Smith - Eye witness&#10;Dr. Jane Doe - Medical examiner&#10;Inspector Ram Kumar - Investigating officer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Procedures Followed (one per line)
              </label>
              <textarea
                name="proceduresFollowed"
                value={formData.proceduresFollowed}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="FIR registered within 24 hours&#10;Accused arrested with warrant&#10;Miranda rights read before questioning"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Context
              </label>
              <textarea
                name="additionalContext"
                value={formData.additionalContext}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Any additional information relevant to the analysis..."
              />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isAnalyzing}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-md font-medium flex items-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Analyzing Case...</span>
              </>
            ) : (
              <>
                <FileText className="h-5 w-5" />
                <span>Analyze Case</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}