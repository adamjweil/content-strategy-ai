"use client";

interface OverallStrategy {
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
}

export function OverallStrategyCard({ strategy }: { strategy: OverallStrategy }) {
  if (!strategy || !strategy.audienceAnalysis) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p>Loading strategy data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-8">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-semibold">Overall Content Strategy</h2>
      </div>

      {/* Content Audit */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Content Audit</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold mb-2">Content Types</h4>
            <div className="space-y-2">
              {strategy.contentAudit.contentTypes.map((type, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <div className="font-medium">{type.type}</div>
                  <div className="text-sm text-gray-600">
                    Frequency: {type.frequency} • Effectiveness: {type.effectiveness}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Writing Styles</h4>
            <div className="space-y-2">
              {strategy.contentAudit.writingStyles.map((style, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <div className="font-medium">{style.style}</div>
                  <div className="text-sm text-gray-600">
                    Usage: {style.usage} • Impact: {style.impact}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Audience Analysis */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Audience Analysis</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Primary Audiences</h4>
            <div className="flex flex-wrap gap-2">
              {strategy.audienceAnalysis.primaryAudiences.map((audience, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {audience}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Audience Needs</h4>
            <ul className="list-disc pl-5">
              {strategy.audienceAnalysis.audienceNeeds?.map((need, index) => (
                <li key={index}>{need}</li>
              )) || <li>No audience needs specified</li>}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Engagement Patterns</h4>
            <p>{strategy.audienceAnalysis.engagementPatterns}</p>
          </div>
        </div>
      </div>

      {/* Content Gaps */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Content Gaps</h3>
        <div className="space-y-3">
          {strategy.contentGaps.map((gap, index) => (
            <div key={index} className="bg-yellow-50 p-4 rounded">
              <div className="font-medium text-yellow-800">{gap.topic}</div>
              <div className="text-sm text-yellow-700 mt-1">
                Opportunity: {gap.opportunity}
              </div>
              <div className="text-sm text-yellow-700">
                Priority: {gap.priority}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Plan */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Action Plan</h3>
        <div className="space-y-4">
          {strategy.actionPlan.map((action, index) => (
            <div key={index} className="border-l-4 border-green-500 pl-4">
              <div className="font-medium">{action.action}</div>
              <div className="text-sm text-gray-600">
                Timeline: {action.timeline} • Expected Impact: {action.expectedImpact}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 