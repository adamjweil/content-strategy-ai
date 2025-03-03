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
  metrics?: {
    views: number;
    engagementRate: number;
    avgFinishTime: number;
    avgAttentionSpan: number;
    attentionTime: number;
  };
}

export function PrintableStrategyCard({ strategy }: { strategy: OverallStrategy }) {
  if (!strategy || !strategy.audienceAnalysis) {
    return (
      <div style={{ padding: '1.5rem', backgroundColor: '#FFFFFF', borderRadius: '0.5rem' }}>
        <p>Loading strategy data...</p>
      </div>
    );
  }

  const styles = {
    container: {
      backgroundColor: '#FFFFFF',
      padding: '1.5rem',
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    },
    header: {
      borderBottom: '1px solid #E5E7EB',
      paddingBottom: '0.5rem',
      marginBottom: '1.5rem',
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 600,
      color: '#111827',
    },
    section: {
      marginBottom: '1.5rem',
    },
    sectionTitle: {
      fontSize: '1.125rem',
      fontWeight: 600,
      marginBottom: '0.5rem',
      color: '#111827',
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '0.75rem',
      marginBottom: '1rem',
    },
    metricCard: {
      padding: '0.75rem',
      borderRadius: '0.5rem',
    },
    metricLabel: {
      fontSize: '0.875rem',
      fontWeight: 500,
      marginBottom: '0.25rem',
    },
    metricValue: {
      fontSize: '1.25rem',
      fontWeight: 700,
    },
    grid2Cols: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
      marginBottom: '1rem',
    },
    tag: {
      display: 'inline-block',
      padding: '0.25rem 0.75rem',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      marginRight: '0.5rem',
      marginBottom: '0.5rem',
    },
    contentGapCard: {
      backgroundColor: '#FFFBEB',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '0.75rem',
    },
    actionCard: {
      backgroundColor: '#F0FDF4',
      padding: '1rem',
      borderRadius: '0.5rem',
      marginBottom: '0.75rem',
    },
  };

  const metrics = strategy.metrics || {
    views: 14873,
    engagementRate: 71.4,
    avgFinishTime: 146.0,
    avgAttentionSpan: 141.0,
    attentionTime: 6.0
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Overall Content Strategy</h2>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Content Performance Metrics</h3>
        <div style={styles.metricsGrid}>
          <div style={{ ...styles.metricCard, backgroundColor: '#EFF6FF' }}>
            <div style={{ ...styles.metricLabel, color: '#1E40AF' }}>Views</div>
            <div style={{ ...styles.metricValue, color: '#1E3A8A' }}>{metrics.views.toLocaleString()}</div>
          </div>
          <div style={{ ...styles.metricCard, backgroundColor: '#F0FDF4' }}>
            <div style={{ ...styles.metricLabel, color: '#166534' }}>Engagement Rate</div>
            <div style={{ ...styles.metricValue, color: '#14532D' }}>{metrics.engagementRate}%</div>
          </div>
          <div style={{ ...styles.metricCard, backgroundColor: '#F5F3FF' }}>
            <div style={{ ...styles.metricLabel, color: '#5B21B6' }}>Avg. Finish Time</div>
            <div style={{ ...styles.metricValue, color: '#4C1D95' }}>{metrics.avgFinishTime}s</div>
          </div>
          <div style={{ ...styles.metricCard, backgroundColor: '#FFFBEB' }}>
            <div style={{ ...styles.metricLabel, color: '#B45309' }}>Avg. Attention Span</div>
            <div style={{ ...styles.metricValue, color: '#92400E' }}>{metrics.avgAttentionSpan}s</div>
          </div>
          <div style={{ ...styles.metricCard, backgroundColor: '#EEF2FF' }}>
            <div style={{ ...styles.metricLabel, color: '#3730A3' }}>Attention Time</div>
            <div style={{ ...styles.metricValue, color: '#312E81' }}>{metrics.attentionTime}m</div>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Content Audit</h3>
        <div style={styles.grid2Cols}>
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4B5563', marginBottom: '0.5rem' }}>
              Content Types
            </h4>
            <div>
              {strategy.contentAudit.contentTypes.map((type, index) => (
                <span key={index} style={{ ...styles.tag, backgroundColor: '#F3F4F6' }}>
                  <span style={{ fontWeight: 500 }}>{type.type}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', marginLeft: '0.25rem' }}>
                    ({type.frequency}, {type.effectiveness})
                  </span>
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4B5563', marginBottom: '0.5rem' }}>
              Writing Styles
            </h4>
            <div>
              {strategy.contentAudit.writingStyles.map((style, index) => (
                <span key={index} style={{ ...styles.tag, backgroundColor: '#F3F4F6' }}>
                  <span style={{ fontWeight: 500 }}>{style.style}</span>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', marginLeft: '0.25rem' }}>
                    ({style.usage}, {style.impact})
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Audience Analysis</h3>
        <div style={styles.grid2Cols}>
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4B5563', marginBottom: '0.5rem' }}>
              Primary Audiences
            </h4>
            <div>
              {strategy.audienceAnalysis.primaryAudiences.map((audience, index) => (
                <span key={index} style={{ ...styles.tag, backgroundColor: '#EFF6FF', color: '#1E40AF' }}>
                  {audience}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4B5563', marginBottom: '0.5rem' }}>
              Audience Needs
            </h4>
            <div>
              {strategy.audienceAnalysis.audienceNeeds.map((need, index) => (
                <span key={index} style={{ ...styles.tag, backgroundColor: '#F3F4F6' }}>
                  {need}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 500, color: '#4B5563', marginBottom: '0.25rem' }}>
            Engagement Patterns
          </h4>
          <p style={{ fontSize: '0.875rem' }}>{strategy.audienceAnalysis.engagementPatterns}</p>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Content Gaps</h3>
        <div>
          {strategy.contentGaps.map((gap, index) => (
            <div key={index} style={styles.contentGapCard}>
              <div style={{ fontWeight: 500, color: '#92400E' }}>{gap.topic}</div>
              <div style={{ fontSize: '0.75rem', color: '#B45309', marginTop: '0.25rem' }}>
                {gap.opportunity} • {gap.priority}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Action Plan</h3>
        <div>
          {strategy.actionPlan.map((action, index) => (
            <div key={index} style={styles.actionCard}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ height: '1.5rem', width: '1.5rem', borderRadius: '9999px', backgroundColor: '#BBF7D0', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                    {index + 1}
                  </div>
                  <div style={{ fontWeight: 500, color: '#166534', fontSize: '0.875rem', marginBottom: '0.75rem' }}>
                    {action.action}
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span>{action.timeline}</span>
                  <span>{action.expectedImpact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 