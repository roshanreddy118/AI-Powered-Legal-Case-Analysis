'use client';

import { AnalysisResult, Severity, Priority } from '@/types/legal';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  FileText, 
  Users, 
  Scale,
  ArrowLeft,
  Download,
  Share
} from 'lucide-react';

interface AnalysisResultsProps {
  result: AnalysisResult | null;
  onNewAnalysis: () => void;
}

export default function AnalysisResults({ result, onNewAnalysis }: AnalysisResultsProps) {
  if (!result) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No analysis results available.</p>
      </div>
    );
  }

  const getRiskColor = (score: number) => {
    if (score >= 8) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 6) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (score >= 4) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getSeverityIcon = (severity: Severity) => {
    switch (severity) {
      case 'Critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'High':
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
      case 'Medium':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'Low':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority: Priority) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (priority) {
      case 'Urgent':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'High':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'Medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Low':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-8 bg-gradient-to-br from-slate-900/90 to-purple-900/90 backdrop-blur-xl rounded-3xl border border-purple-500/20">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
            <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Analysis Results
            </span>
          </h2>
          <p className="text-white/70 text-lg">
            AI analysis completed on {result.analysisDate.toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onNewAnalysis}
            className="group flex items-center space-x-2 px-6 py-3 bg-black/40 hover:bg-black/60 backdrop-blur-xl text-white rounded-xl transition-all duration-300 border border-white/20 hover:border-white/40 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <ArrowLeft className="h-4 w-4 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" />
            <span>New Analysis</span>
          </button>
          <button className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 hover:from-indigo-400/30 hover:to-purple-400/30 backdrop-blur-xl text-indigo-300 hover:text-indigo-200 rounded-xl transition-all duration-300 border border-indigo-500/30 hover:border-indigo-400/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]">
            <Download className="h-4 w-4 group-hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
            <span>Export Report</span>
          </button>
          <button className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-400/30 hover:to-emerald-400/30 backdrop-blur-xl text-green-300 hover:text-green-200 rounded-xl transition-all duration-300 border border-green-500/30 hover:border-green-400/50 hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            <Share className="h-4 w-4 group-hover:drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`group border-2 rounded-2xl p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 ${getRiskColor(result.riskScore)} hover:shadow-2xl`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Risk Score</h3>
            <div className="relative">
              <Scale className="h-8 w-8 drop-shadow-[0_0_15px_currentColor] group-hover:drop-shadow-[0_0_25px_currentColor] transition-all duration-500" />
              <div className="absolute inset-0 h-8 w-8 bg-current rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            </div>
          </div>
          <div className="text-4xl font-bold mb-2 drop-shadow-[0_0_10px_currentColor]">{result.riskScore}/10</div>
          <p className="text-sm opacity-75">
            {result.riskScore >= 8 && "Critical risk detected"}
            {result.riskScore >= 6 && result.riskScore < 8 && "High risk identified"}
            {result.riskScore >= 4 && result.riskScore < 6 && "Moderate risk found"}
            {result.riskScore < 4 && "Low risk assessment"}
          </p>
        </div>

        <div className="group border-2 rounded-2xl p-6 bg-gradient-to-br from-blue-900/30 to-cyan-900/30 backdrop-blur-xl border-blue-500/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Confidence Level</h3>
            <div className="relative">
              <CheckCircle className="h-8 w-8 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.7)] group-hover:drop-shadow-[0_0_25px_rgba(59,130,246,0.9)] transition-all duration-500" />
              <div className="absolute inset-0 h-8 w-8 bg-blue-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            </div>
          </div>
          <div className={`text-4xl font-bold mb-2 drop-shadow-[0_0_10px_currentColor] ${getConfidenceColor(result.confidence)}`}>
            {Math.round(result.confidence * 100)}%
          </div>
          <p className="text-sm text-blue-300 group-hover:text-blue-200 transition-colors duration-300">
            Analysis confidence score
          </p>
        </div>

        <div className="group border-2 rounded-2xl p-6 bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-xl border-purple-500/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Analysis Type</h3>
            <div className="relative">
              <FileText className="h-8 w-8 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.7)] group-hover:drop-shadow-[0_0_25px_rgba(168,85,247,0.9)] transition-all duration-500" />
              <div className="absolute inset-0 h-8 w-8 bg-purple-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            </div>
          </div>
          <div className="text-lg font-medium text-purple-200 mb-2 group-hover:text-purple-100 transition-colors duration-300">
            {result.analysisType}
          </div>
          <p className="text-sm text-purple-300 group-hover:text-purple-200 transition-colors duration-300">
            AI Model: {result.aiModel}
          </p>
        </div>
      </div>

      {/* Findings Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Key Findings
          </span>
        </h3>
        
        {result.findings.length === 0 ? (
          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 backdrop-blur-xl border-2 border-green-500/30 rounded-2xl p-6 hover:shadow-[0_0_40px_rgba(34,197,94,0.2)] transition-all duration-500">
            <div className="flex items-center">
              <div className="relative mr-4">
                <CheckCircle className="h-8 w-8 text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.7)]" />
                <div className="absolute inset-0 h-8 w-8 bg-green-400 rounded-full blur-lg opacity-20"></div>
              </div>
              <div>
                <h4 className="text-xl font-medium text-white drop-shadow-sm">No Critical Issues Found</h4>
                <p className="text-green-300">The analysis did not identify any significant concerns with this case.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {result.findings.map((finding, index) => (
              <div key={index} className="group bg-black/30 backdrop-blur-xl border border-white/20 hover:border-white/40 rounded-2xl p-6 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      {getSeverityIcon(finding.severity)}
                      <div className="absolute inset-0 h-5 w-5 bg-current rounded-full blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white group-hover:text-gray-200 transition-colors duration-300">{finding.category}</h4>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        finding.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                        finding.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                        finding.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {finding.severity}
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-white/80 mb-4 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">{finding.description}</p>
                
                {finding.evidence && finding.evidence.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-cyan-300 mb-2 drop-shadow-sm">Supporting Evidence:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-white/70">
                      {finding.evidence.map((evidence, evidenceIndex) => (
                        <li key={evidenceIndex} className="hover:text-white/90 transition-colors duration-200">{evidence}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {finding.precedents && finding.precedents.length > 0 && (
                  <div>
                    <h5 className="font-medium text-purple-300 mb-2 drop-shadow-sm">Related Precedents:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-white/70">
                      {finding.precedents.map((precedent, precedentIndex) => (
                        <li key={precedentIndex} className="hover:text-white/90 transition-colors duration-200">{precedent}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommendations Section */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Recommendations
          </span>
        </h3>
        
        {result.recommendations.length === 0 ? (
          <div className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-xl border border-gray-500/30 rounded-2xl p-6 hover:shadow-[0_0_20px_rgba(107,114,128,0.2)] transition-all duration-300">
            <p className="text-white/70">No specific recommendations at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="group bg-black/30 backdrop-blur-xl border border-white/20 hover:border-white/40 rounded-2xl p-6 shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Users className="h-6 w-6 text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.7)]" />
                      <div className="absolute inset-0 h-6 w-6 bg-indigo-400 rounded-full blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white group-hover:text-gray-200 transition-colors duration-300">{recommendation.type}</h4>
                      <span className={getPriorityBadge(recommendation.priority)}>
                        {recommendation.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-white/80 mb-4 group-hover:text-white/90 transition-colors duration-300 leading-relaxed">{recommendation.description}</p>
                
                {recommendation.actionItems && recommendation.actionItems.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-green-300 mb-2 drop-shadow-sm">Action Items:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-white/70">
                      {recommendation.actionItems.map((item, itemIndex) => (
                        <li key={itemIndex} className="hover:text-white/90 transition-colors duration-200">{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {recommendation.timeline && (
                  <div className="flex items-center space-x-2 text-sm text-white/60">
                    <Clock className="h-4 w-4 text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                    <span>Timeline: {recommendation.timeline}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
        <div className="flex items-center justify-between text-sm text-white/60">
          <div>
            <p className="hover:text-white/80 transition-colors duration-200">Analysis ID: {result.id}</p>
            <p className="hover:text-white/80 transition-colors duration-200">Case ID: {result.caseId}</p>
          </div>
          <div className="text-right">
            <p className="hover:text-white/80 transition-colors duration-200">Generated on: {result.analysisDate.toLocaleString()}</p>
            <p className="hover:text-white/80 transition-colors duration-200">AI Model: {result.aiModel}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-xs text-white/40 text-center leading-relaxed hover:text-white/60 transition-colors duration-300">
            This analysis is generated by AI and should be reviewed by qualified legal professionals. 
            It is intended to assist in identifying potential issues and should not replace human judgment.
          </p>
        </div>
      </div>
    </div>
  );
}