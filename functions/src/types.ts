export interface AnalysisResult {
  url: string;
  content?: {
    title: string;
    wordCount: number;
  };
  analysis?: {
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
  analytics?: {
    views: number;
    engagementRate: number;
    avgFinishTime: number;
    avgAttentionSpan: number;
    attentionTimeMinutes: number;
  };
  error?: string;
  status: 'success' | 'error';
  analyzedAt: string;
} 