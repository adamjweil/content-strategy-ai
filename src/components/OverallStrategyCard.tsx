"use client";

import React from 'react';
import { OverallStrategy } from '@/types';

interface OverallStrategyCardProps {
  strategy: OverallStrategy;
}

export default function OverallStrategyCard({ strategy }: OverallStrategyCardProps) {
  if (!strategy || !strategy.audienceAnalysis) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p>Loading strategy data...</p>
      </div>
    );
  }

  // Mock metrics if not provided
  const metrics = strategy.metrics || {
    views: 14873,
    engagementRate: 71.4,
    avgFinishTime: 146.0,
    avgAttentionSpan: 141.0,
    attentionTime: 6.0
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg space-y-6">
      <div className="border-b pb-2">
        <h2 className="text-xl font-semibold">Overall Content Strategy</h2>
      </div>

      {/* Metrics Dashboard */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Content Performance Metrics</h3>
        
        {/* Metrics Cards */}
        <div className="grid grid-cols-5 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Views</div>
            <div className="text-2xl font-bold text-blue-800">{metrics.views.toLocaleString()}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Engagement Rate</div>
            <div className="text-2xl font-bold text-green-800">{metrics.engagementRate}%</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Avg. Finish Time</div>
            <div className="text-2xl font-bold text-purple-800">{metrics.avgFinishTime}s</div>
          </div>
          <div className="bg-amber-50 p-3 rounded-lg">
            <div className="text-sm text-amber-600 font-medium">Avg. Attention Span</div>
            <div className="text-2xl font-bold text-amber-800">{metrics.avgAttentionSpan}s</div>
          </div>
          <div className="bg-indigo-50 p-3 rounded-lg">
            <div className="text-sm text-indigo-600 font-medium">Attention Time</div>
            <div className="text-2xl font-bold text-indigo-800">{metrics.attentionTime}m</div>
          </div>
        </div>

        {/* Insights Summary */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Insights</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              • Strong engagement rate of {metrics.engagementRate}% indicates content is resonating well with the audience
            </p>
            <p>
              • Average finish time ({metrics.avgFinishTime}s) and attention span ({metrics.avgAttentionSpan}s) suggest content length is well-optimized
            </p>
            <p>
              • Total attention time of {metrics.attentionTime}m demonstrates strong audience retention
            </p>
            <p>
              • {metrics.views.toLocaleString()} views show healthy content reach and distribution
            </p>
          </div>
        </div>
      </div>

      {/* Content Audit */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Content Audit</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Content Types</h4>
            <div className="flex flex-wrap gap-2">
              {strategy.contentAudit.contentTypes.map((type, index) => (
                <div key={index} className="bg-gray-50 px-3 py-1 rounded-md text-sm flex-shrink-0">
                  <span className="font-medium">{type.type}</span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({type.frequency}, {type.effectiveness})
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Writing Styles</h4>
            <div className="flex flex-wrap gap-2">
              {strategy.contentAudit.writingStyles.map((style, index) => (
                <div key={index} className="bg-gray-50 px-3 py-1 rounded-md text-sm flex-shrink-0">
                  <span className="font-medium">{style.style}</span>
                  <span className="text-xs text-gray-500 ml-1">
                    ({style.usage}, {style.impact})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Audience Analysis */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Audience Analysis</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Primary Audiences</h4>
            <div className="flex flex-wrap gap-2">
              {strategy.audienceAnalysis.primaryAudiences.map((audience, index) => (
                <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  {audience}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-2">Audience Needs</h4>
            <div className="flex flex-wrap gap-2">
              {strategy.audienceAnalysis.audienceNeeds.map((need, index) => (
                <span key={index} className="bg-gray-50 px-3 py-1 rounded-md text-sm">
                  {need}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-2">
          <h4 className="text-sm font-medium text-gray-600 mb-1">Engagement Patterns</h4>
          <p className="text-sm">{strategy.audienceAnalysis.engagementPatterns}</p>
        </div>
      </div>

      {/* Content Gaps */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Content Gaps</h3>
        <div className="flex items-stretch gap-3">
          {strategy.contentGaps.map((gap, index) => (
            <div key={index} className="flex-1 bg-yellow-50 px-4 py-3 rounded-lg text-sm min-w-[15rem] border border-yellow-200 shadow-sm">
              <div className="font-medium text-yellow-800">{gap.topic}</div>
              <div className="text-xs text-yellow-700 mt-1">
                {gap.opportunity} • {gap.priority}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Plan */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Action Plan</h3>
        <div className="overflow-x-auto">
          <div className="flex items-stretch gap-2 pb-2 w-full">
            {strategy.actionPlan.map((action, index) => (
              <React.Fragment key={index}>
                <div className="flex-1 relative bg-gradient-to-r from-green-50 to-green-100 px-3 rounded-lg border border-green-200 shadow-sm group hover:shadow-md transition-shadow duration-200 min-w-[12rem] h-32">
                  <div className="flex flex-col items-center text-center h-full justify-between py-3">
                    <div className="h-6 w-6 rounded-full bg-green-200 text-green-800 flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="w-full px-1">
                      <div className="font-medium text-green-800 text-sm line-clamp-2 min-h-[2.5rem]">{action.action}</div>
                    </div>
                    <div className="w-full">
                      <div className="text-xs text-green-700 flex items-center justify-center gap-3">
                        <span className="inline-flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {action.timeline}
                        </span>
                        <span className="inline-flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          {action.expectedImpact}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {index < strategy.actionPlan.length - 1 && (
                  <div className="flex-shrink-0 flex items-center">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 