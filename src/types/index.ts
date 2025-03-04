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
  analytics: {
    views: number;
    engagementRate: number;
    avgFinishTime: number;
    avgAttentionSpan: number;
    attentionTimeMinutes: number;
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
  aiInsights: {
    audienceReason: string;
    contentTypeReason: string;
    timingReason: string;
    strategicValue: string;
  };
}

export type OverallStrategy = {
  contentAudit: {
    contentTypes: Array<{
      type: string;
      frequency: string;
      effectiveness: string;
    }>;
    writingStyles: Array<{
      style: string;
      usage: string;
      impact: string;
    }>;
  };
  audienceAnalysis: {
    primaryAudiences: string[];
    audienceNeeds: string[];
    engagementPatterns: string;
  };
  contentGaps: Array<{
    topic: string;
    opportunity: string;
    priority: string;
  }>;
  recommendations: {
    contentMix: string;
    topicClusters: string[];
    contentCalendar: Array<{
      contentType: string;
      frequency: string;
      focus: string;
    }>;
  };
  brandVoice: {
    currentTone: string;
    consistencyScore: string;
    improvements: string[];
  };
  actionPlan: Array<{
    action: string;
    timeline: string;
    expectedImpact: string;
  }>;
  metrics?: {
    views: number;
    engagementRate: number;
    avgFinishTime: number;
    avgAttentionSpan: number;
    attentionTime: number;
  };
}; 