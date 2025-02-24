"use client";

interface AnalysisResult {
  url: string;
  content: {
    title: string;
    wordCount: number;
  };
  analysis: {
    summary: {
      overview: string;
      strengths: string[];
      weaknesses: string[];
    };
    seoAnalysis: {
      score: string;
      recommendations: string[];
    };
    contentQuality: {
      score: string;
      suggestions: string[];
    };
    strategy: {
      targetAudience: string;
      contentGaps: string[];
      actionItems: string[];
    };
  };
  status: 'success' | 'error';
  error?: string;
}

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
      {/* Rest of the ResultCard component from your original page.tsx */}
    </div>
  );
} 