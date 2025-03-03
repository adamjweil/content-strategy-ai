import { AnalysisResult } from '@/types';

export function PrintableResultCard({ result }: { result: AnalysisResult }) {
  if (result.status === 'error') {
    return (
      <div style={{ padding: '1rem', backgroundColor: '#FEF2F2', color: '#DC2626' }}>
        <p>Error analyzing {result.url}: {result.error}</p>
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
      paddingBottom: '1rem',
      marginBottom: '1.5rem',
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#111827',
    },
    subtitle: {
      color: '#6B7280',
      fontSize: '0.875rem',
    },
    section: {
      marginBottom: '1.5rem',
    },
    sectionTitle: {
      fontSize: '1.25rem',
      fontWeight: 600,
      marginBottom: '1rem',
      color: '#111827',
    },
    metricsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(5, 1fr)',
      gap: '1rem',
      marginBottom: '1.5rem',
    },
    metricCard: {
      padding: '1rem',
      borderRadius: '0.5rem',
    },
    metricLabel: {
      fontSize: '0.875rem',
      fontWeight: 500,
      marginBottom: '0.5rem',
    },
    metricValue: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
    list: {
      listStyle: 'disc',
      paddingLeft: '1.5rem',
      marginTop: '0.5rem',
    },
    listItem: {
      marginBottom: '0.25rem',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Analysis Results</h2>
        <p style={styles.subtitle}>
          {result.content.title} ({result.content.wordCount} words)
        </p>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Analytics Metrics</h3>
        <div style={styles.metricsGrid}>
          <div style={{ ...styles.metricCard, backgroundColor: '#EFF6FF' }}>
            <h4 style={{ ...styles.metricLabel, color: '#1E40AF' }}>Views</h4>
            <p style={{ ...styles.metricValue, color: '#1E3A8A' }}>
              {result.analytics?.views?.toLocaleString() || 'N/A'}
            </p>
          </div>
          <div style={{ ...styles.metricCard, backgroundColor: '#F0FDF4' }}>
            <h4 style={{ ...styles.metricLabel, color: '#166534' }}>Engagement Rate</h4>
            <p style={{ ...styles.metricValue, color: '#14532D' }}>
              {result.analytics?.engagementRate ? `${(result.analytics.engagementRate * 100).toFixed(1)}%` : 'N/A'}
            </p>
          </div>
          <div style={{ ...styles.metricCard, backgroundColor: '#F5F3FF' }}>
            <h4 style={{ ...styles.metricLabel, color: '#5B21B6' }}>Avg. Finish Time</h4>
            <p style={{ ...styles.metricValue, color: '#4C1D95' }}>
              {result.analytics?.avgFinishTime ? `${result.analytics.avgFinishTime.toFixed(1)}s` : 'N/A'}
            </p>
          </div>
          <div style={{ ...styles.metricCard, backgroundColor: '#FFFBEB' }}>
            <h4 style={{ ...styles.metricLabel, color: '#B45309' }}>Avg. Attention Span</h4>
            <p style={{ ...styles.metricValue, color: '#92400E' }}>
              {result.analytics?.avgAttentionSpan ? `${result.analytics.avgAttentionSpan.toFixed(1)}s` : 'N/A'}
            </p>
          </div>
          <div style={{ ...styles.metricCard, backgroundColor: '#EEF2FF' }}>
            <h4 style={{ ...styles.metricLabel, color: '#3730A3' }}>Attention Time</h4>
            <p style={{ ...styles.metricValue, color: '#312E81' }}>
              {result.analytics?.attentionTimeMinutes ? `${result.analytics.attentionTimeMinutes.toFixed(1)}m` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Overview</h3>
        <p style={{ marginBottom: '1rem' }}>{result.analysis.summary.overview}</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ backgroundColor: '#F0FDF4', padding: '1rem', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#166534', fontWeight: 600, marginBottom: '0.5rem' }}>Strengths</h4>
            <ul style={styles.list}>
              {result.analysis.summary.strengths?.map((strength, index) => (
                <li key={index} style={{ ...styles.listItem, color: '#166534' }}>{strength}</li>
              )) || <li style={{ ...styles.listItem, color: '#166534' }}>No strengths identified</li>}
            </ul>
          </div>
          <div style={{ backgroundColor: '#FEF2F2', padding: '1rem', borderRadius: '0.5rem' }}>
            <h4 style={{ color: '#991B1B', fontWeight: 600, marginBottom: '0.5rem' }}>Weaknesses</h4>
            <ul style={styles.list}>
              {result.analysis.summary.weaknesses?.map((weakness, index) => (
                <li key={index} style={{ ...styles.listItem, color: '#991B1B' }}>{weakness}</li>
              )) || <li style={{ ...styles.listItem, color: '#991B1B' }}>No weaknesses identified</li>}
            </ul>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>SEO Analysis</h3>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Score:</span>
            <span style={{ fontWeight: 600 }}>{result.analysis.seoAnalysis?.score || 'N/A'}/100</span>
          </div>
        </div>
        <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Recommendations</h4>
        <ul style={styles.list}>
          {result.analysis.seoAnalysis?.recommendations?.map((rec, index) => (
            <li key={index} style={styles.listItem}>{rec}</li>
          )) || <li style={styles.listItem}>No recommendations available</li>}
        </ul>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Content Quality</h3>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>Score:</span>
            <span style={{ fontWeight: 600 }}>{result.analysis.contentQuality?.score || 'N/A'}/100</span>
          </div>
        </div>
        <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Suggestions</h4>
        <ul style={styles.list}>
          {result.analysis.contentQuality?.suggestions?.map((suggestion, index) => (
            <li key={index} style={styles.listItem}>{suggestion}</li>
          )) || <li style={styles.listItem}>No suggestions available</li>}
        </ul>
      </div>

      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Content Strategy</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Target Audience</h4>
            <p>{result.analysis.strategy?.targetAudience || 'No target audience specified'}</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Content Gaps</h4>
            <ul style={styles.list}>
              {result.analysis.strategy?.contentGaps?.map((gap, index) => (
                <li key={index} style={styles.listItem}>{gap}</li>
              )) || <li style={styles.listItem}>No content gaps identified</li>}
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Action Items</h4>
            <ul style={styles.list}>
              {result.analysis.strategy?.actionItems?.map((item, index) => (
                <li key={index} style={styles.listItem}>{item}</li>
              )) || <li style={styles.listItem}>No action items available</li>}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 