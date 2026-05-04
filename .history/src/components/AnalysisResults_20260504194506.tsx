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
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Results</h2>
          <p className="text-gray-600">
            AI analysis completed on {result.analysisDate.toLocaleString()}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onNewAnalysis}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>New Analysis</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-md transition-colors">
            <Download className="h-4 w-4" />
            <span>Export Report</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-md transition-colors">
            <Share className="h-4 w-4" />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`border rounded-lg p-6 ${getRiskColor(result.riskScore)}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Risk Score</h3>
            <Scale className="h-6 w-6" />
          </div>
          <div className="text-3xl font-bold mb-2">{result.riskScore}/10</div>
          <p className="text-sm opacity-75">
            {result.riskScore >= 8 && "Critical risk detected"}
            {result.riskScore >= 6 && result.riskScore < 8 && "High risk identified"}
            {result.riskScore >= 4 && result.riskScore < 6 && "Moderate risk found"}
            {result.riskScore < 4 && "Low risk assessment"}
          </p>
        </div>

        <div className="border rounded-lg p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900">Confidence Level</h3>
            <CheckCircle className="h-6 w-6 text-blue-600" />
          </div>
          <div className={`text-3xl font-bold mb-2 ${getConfidenceColor(result.confidence)}`}>
            {Math.round(result.confidence * 100)}%
          </div>
          <p className="text-sm text-blue-700">
            Analysis confidence score
          </p>
        </div>

        <div className="border rounded-lg p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-purple-900">Analysis Type</h3>
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <div className="text-lg font-medium text-purple-800 mb-2">
            {result.analysisType}
          </div>
          <p className="text-sm text-purple-700">
            AI Model: {result.aiModel}
          </p>
        </div>
      </div>

      {/* Findings Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Key Findings</h3>
        
        {result.findings.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h4 className="text-lg font-medium text-green-900">No Critical Issues Found</h4>
                <p className="text-green-700">The analysis did not identify any significant concerns with this case.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {result.findings.map((finding, index) => (
              <div key={index} className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getSeverityIcon(finding.severity)}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{finding.category}</h4>
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
                
                <p className="text-gray-700 mb-4">{finding.description}</p>
                
                {finding.evidence && finding.evidence.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Supporting Evidence:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {finding.evidence.map((evidence, evidenceIndex) => (
                        <li key={evidenceIndex}>{evidence}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {finding.precedents && finding.precedents.length > 0 && (
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Related Precedents:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {finding.precedents.map((precedent, precedentIndex) => (
                        <li key={precedentIndex}>{precedent}</li>
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
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recommendations</h3>
        
        {result.recommendations.length === 0 ? (
          <div className="bg-gray-50 border rounded-lg p-6">
            <p className="text-gray-600">No specific recommendations at this time.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {result.recommendations.map((recommendation, index) => (
              <div key={index} className="bg-white border rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-indigo-600" />
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{recommendation.type}</h4>
                      <span className={getPriorityBadge(recommendation.priority)}>
                        {recommendation.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{recommendation.description}</p>
                
                {recommendation.actionItems && recommendation.actionItems.length > 0 && (
                  <div className="mb-4">
                    <h5 className="font-medium text-gray-900 mb-2">Action Items:</h5>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {recommendation.actionItems.map((item, itemIndex) => (
                        <li key={itemIndex}>{item}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {recommendation.timeline && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>Timeline: {recommendation.timeline}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div>
            <p>Analysis ID: {result.id}</p>
            <p>Case ID: {result.caseId}</p>
          </div>
          <div className="text-right">
            <p>Generated on: {result.analysisDate.toLocaleString()}</p>
            <p>AI Model: {result.aiModel}</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            This analysis is generated by AI and should be reviewed by qualified legal professionals. 
            It is intended to assist in identifying potential issues and should not replace human judgment.
          </p>
        </div>
      </div>
    </div>
  );
}