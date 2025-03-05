"use client";

import { AnalysisResult } from '@/types';

export function ResultCard({ result }: { result: AnalysisResult }) {
  if (result.status === 'error') {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">Error analyzing {result.url}: {result.error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-semibold">Analysis Results</h2>
        <p className="text-gray-600">
          {result.content?.title || 'Untitled'} ({result.content?.wordCount || 0} words)
        </p>
      </div>

      {/* Analytics Metrics */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Analytics Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-blue-700">Views</h4>
            <p className="text-2xl font-bold text-blue-900">{result.analytics?.views?.toLocaleString() || 'N/A'}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-green-700">Engagement Rate</h4>
            <p className="text-2xl font-bold text-green-900">
              {result.analytics?.engagementRate ? `${(result.analytics.engagementRate * 100).toFixed(1)}%` : 'N/A'}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-purple-700">Avg. Finish Time</h4>
            <p className="text-2xl font-bold text-purple-900">
              {result.analytics?.avgFinishTime ? `${result.analytics.avgFinishTime.toFixed(1)}s` : 'N/A'}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-700">Avg. Attention Span</h4>
            <p className="text-2xl font-bold text-yellow-900">
              {result.analytics?.avgAttentionSpan ? `${result.analytics.avgAttentionSpan.toFixed(1)}s` : 'N/A'}
            </p>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-indigo-700">Attention Time</h4>
            <p className="text-2xl font-bold text-indigo-900">
              {result.analytics?.attentionTimeMinutes ? `${result.analytics.attentionTimeMinutes.toFixed(1)}m` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Content Overview */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Overview</h3>
        <p className="mb-4">{result.analysis?.summary?.overview || 'No overview available'}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-700">Strengths</h4>
            <ul className="list-disc pl-5 mt-2">
              {result.analysis?.summary?.strengths?.map((strength, index) => (
                <li key={index} className="text-green-600">{strength}</li>
              )) || <li className="text-green-600">No strengths identified</li>}
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-red-700">Weaknesses</h4>
            <ul className="list-disc pl-5 mt-2">
              {result.analysis?.summary?.weaknesses?.map((weakness, index) => (
                <li key={index} className="text-red-600">{weakness}</li>
              )) || <li className="text-red-600">No weaknesses identified</li>}
            </ul>
          </div>
        </div>
      </div>

      {/* SEO Analysis */}
      <div>
        <h3 className="text-xl font-semibold mb-2">SEO Analysis</h3>
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span>Score:</span>
            <span className="font-semibold">{result.analysis?.seoAnalysis?.score || 'N/A'}/100</span>
          </div>
        </div>
        <h4 className="font-semibold">Recommendations</h4>
        <ul className="list-disc pl-5">
          {result.analysis?.seoAnalysis?.recommendations?.map((rec, index) => (
            <li key={index}>{rec}</li>
          )) || <li>No recommendations available</li>}
        </ul>
      </div>

      {/* Content Quality */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Content Quality</h3>
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span>Score:</span>
            <span className="font-semibold">{result.analysis?.contentQuality?.score || 'N/A'}/100</span>
          </div>
        </div>
        <h4 className="font-semibold">Suggestions</h4>
        <ul className="list-disc pl-5">
          {result.analysis?.contentQuality?.suggestions?.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          )) || <li>No suggestions available</li>}
        </ul>
      </div>

      {/* Strategy */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Content Strategy</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Target Audience</h4>
            <p>{result.analysis?.strategy?.targetAudience || 'No target audience specified'}</p>
          </div>
          <div>
            <h4 className="font-semibold">Content Gaps</h4>
            <ul className="list-disc pl-5">
              {result.analysis?.strategy?.contentGaps?.map((gap, index) => (
                <li key={index}>{gap}</li>
              )) || <li>No content gaps identified</li>}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Action Items</h4>
            <ul className="list-disc pl-5">
              {result.analysis?.strategy?.actionItems?.map((item, index) => (
                <li key={index}>{item}</li>
              )) || <li>No action items available</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 