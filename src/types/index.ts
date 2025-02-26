export interface SavedURL {
  id: string;
  url: string;
  title?: string;
  createdAt: string;
  lastAnalyzed?: string;
  userId: string;
}

export interface AnalysisResult {
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
  analyzedAt: string;
}

export interface Analysis {
  id: string;
  userId: string;
  urlIds: string[];
  urls: string[];
  results: AnalysisResult[];
  overallStrategy: any; // You can create a specific type for this
  createdAt: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  contentType: string;
  date: Date;
  audience: string;
  focus: string;
} 