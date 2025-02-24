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
          {result.content.title} ({result.content.wordCount} words)
        </p>
      </div>

      {/* Content Overview */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Overview</h3>
        <p className="mb-4">{result.analysis.summary.overview}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-semibold text-green-700">Strengths</h4>
            <ul className="list-disc pl-5 mt-2">
              {result.analysis.summary.strengths.map((strength, index) => (
                <li key={index} className="text-green-600">{strength}</li>
              ))}
            </ul>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-semibold text-red-700">Weaknesses</h4>
            <ul className="list-disc pl-5 mt-2">
              {result.analysis.summary.weaknesses.map((weakness, index) => (
                <li key={index} className="text-red-600">{weakness}</li>
              ))}
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
            <span className="font-semibold">{result.analysis.seoAnalysis.score}/100</span>
          </div>
        </div>
        <h4 className="font-semibold">Recommendations</h4>
        <ul className="list-disc pl-5">
          {result.analysis.seoAnalysis.recommendations.map((rec, index) => (
            <li key={index}>{rec}</li>
          ))}
        </ul>
      </div>

      {/* Content Quality */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Content Quality</h3>
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span>Score:</span>
            <span className="font-semibold">{result.analysis.contentQuality.score}/100</span>
          </div>
        </div>
        <h4 className="font-semibold">Suggestions</h4>
        <ul className="list-disc pl-5">
          {result.analysis.contentQuality.suggestions.map((suggestion, index) => (
            <li key={index}>{suggestion}</li>
          ))}
        </ul>
      </div>

      {/* Strategy */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Content Strategy</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Target Audience</h4>
            <p>{result.analysis.strategy.targetAudience}</p>
          </div>
          <div>
            <h4 className="font-semibold">Content Gaps</h4>
            <ul className="list-disc pl-5">
              {result.analysis.strategy.contentGaps.map((gap, index) => (
                <li key={index}>{gap}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Action Items</h4>
            <ul className="list-disc pl-5">
              {result.analysis.strategy.actionItems.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 