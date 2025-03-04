import { useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { AnalysisResult, OverallStrategy } from '@/types';

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subheader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
  },
  text: {
    fontSize: 10,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 10,
    marginBottom: 4,
    paddingLeft: 10,
  },
  metricRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  metricBox: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
    flex: 1,
  },
  metricLabel: {
    fontSize: 8,
    color: '#6b7280',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  contentContainer: {
    marginBottom: 15,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
    marginBottom: 10,
  },
  tag: {
    fontSize: 8,
    backgroundColor: '#e5e7eb',
    paddingVertical: 3,
    paddingHorizontal: 6,
    marginRight: 5,
    marginBottom: 5,
    borderRadius: 3,
  },
  divider: {
    borderBottom: 1,
    borderBottomColor: '#e5e7eb',
    marginVertical: 10,
  },
  cardContainer: {
    marginTop: 6,
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 5,
  },
});

// Enhanced PDF Document for Overall Strategy
const PDFDocument = ({ strategy }: { strategy: OverallStrategy }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Overall Content Strategy</Text>
      
      {strategy.metrics && (
        <View style={styles.contentContainer}>
          <Text style={styles.subheader}>Performance Metrics</Text>
          <View style={styles.metricRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Views</Text>
              <Text style={styles.metricValue}>{strategy.metrics.views.toLocaleString()}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Engagement Rate</Text>
              <Text style={styles.metricValue}>{strategy.metrics.engagementRate}%</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Avg. Finish Time</Text>
              <Text style={styles.metricValue}>{strategy.metrics.avgFinishTime} min</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.contentContainer}>
        <Text style={styles.subheader}>Content Audit</Text>
        <Text style={styles.sectionTitle}>Content Types</Text>
        {strategy.contentAudit.contentTypes.map((item, index) => (
          <View key={index} style={styles.cardContainer}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: 'bold' }}>{item.type}: </Text>
              {item.frequency} frequency, {item.effectiveness} effectiveness
            </Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Writing Styles</Text>
        {strategy.contentAudit.writingStyles.map((item, index) => (
          <View key={index} style={styles.cardContainer}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: 'bold' }}>{item.style}: </Text>
              {item.usage} usage, {item.impact} impact
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.contentContainer}>
        <Text style={styles.subheader}>Audience Analysis</Text>
        <Text style={styles.sectionTitle}>Primary Audiences</Text>
        <View style={styles.tagContainer}>
          {strategy.audienceAnalysis.primaryAudiences.map((audience, index) => (
            <Text key={index} style={styles.tag}>{audience}</Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Audience Needs</Text>
        <View style={styles.tagContainer}>
          {strategy.audienceAnalysis.audienceNeeds.map((need, index) => (
            <Text key={index} style={styles.tag}>{need}</Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Engagement Patterns</Text>
        <Text style={styles.text}>{strategy.audienceAnalysis.engagementPatterns}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.contentContainer}>
        <Text style={styles.subheader}>Content Gaps</Text>
        {strategy.contentGaps.map((gap, index) => (
          <View key={index} style={styles.cardContainer}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: 'bold' }}>{gap.topic}</Text>
            </Text>
            <Text style={styles.text}>Opportunity: {gap.opportunity}</Text>
            <Text style={styles.text}>Priority: {gap.priority}</Text>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.contentContainer}>
        <Text style={styles.subheader}>Recommendations</Text>
        <Text style={styles.sectionTitle}>Content Mix</Text>
        <Text style={styles.text}>{strategy.recommendations.contentMix}</Text>

        <Text style={styles.sectionTitle}>Topic Clusters</Text>
        <View style={styles.tagContainer}>
          {strategy.recommendations.topicClusters.map((topic, index) => (
            <Text key={index} style={styles.tag}>{topic}</Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Content Calendar</Text>
        {strategy.recommendations.contentCalendar.map((item, index) => (
          <View key={index} style={styles.cardContainer}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: 'bold' }}>{item.contentType}</Text>
            </Text>
            <Text style={styles.text}>Frequency: {item.frequency}</Text>
            <Text style={styles.text}>Focus: {item.focus}</Text>
          </View>
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.contentContainer}>
        <Text style={styles.subheader}>Action Plan</Text>
        {strategy.actionPlan.map((action, index) => (
          <View key={index} style={styles.cardContainer}>
            <Text style={styles.text}>
              <Text style={{ fontWeight: 'bold' }}>{action.action}</Text>
            </Text>
            <Text style={styles.text}>Timeline: {action.timeline}</Text>
            <Text style={styles.text}>Expected Impact: {action.expectedImpact}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

// Enhanced PDF Document for Individual Analysis
const IndividualPDFDocument = ({ result }: { result: AnalysisResult }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>{result.content.title}</Text>
      
      <View style={styles.contentContainer}>
        <Text style={styles.subheader}>Content Overview</Text>
        <View style={styles.metricRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Word Count</Text>
            <Text style={styles.metricValue}>{result.content.wordCount}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Views</Text>
            <Text style={styles.metricValue}>{result.analytics.views}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Engagement Rate</Text>
            <Text style={styles.metricValue}>{result.analytics.engagementRate}%</Text>
          </View>
        </View>
        <View style={styles.metricRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Avg. Finish Time</Text>
            <Text style={styles.metricValue}>{result.analytics.avgFinishTime} min</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Avg. Attention Span</Text>
            <Text style={styles.metricValue}>{result.analytics.avgAttentionSpan} min</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Attention Time</Text>
            <Text style={styles.metricValue}>{result.analytics.attentionTimeMinutes} min</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.contentContainer}>
        <Text style={styles.subheader}>Content Summary</Text>
        <Text style={styles.text}>{result.analysis.summary.overview}</Text>
        
        <Text style={styles.sectionTitle}>Strengths</Text>
        {result.analysis.summary.strengths.map((strength, index) => (
          <Text key={index} style={styles.listItem}>• {strength}</Text>
        ))}

        <Text style={styles.sectionTitle}>Weaknesses</Text>
        {result.analysis.summary.weaknesses.map((weakness, index) => (
          <Text key={index} style={styles.listItem}>• {weakness}</Text>
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.contentContainer}>
        <Text style={styles.subheader}>SEO Analysis</Text>
        <Text style={styles.text}>Score: {result.analysis.seoAnalysis.score}</Text>
        
        <Text style={styles.sectionTitle}>Recommendations</Text>
        {result.analysis.seoAnalysis.recommendations.map((recommendation, index) => (
          <Text key={index} style={styles.listItem}>• {recommendation}</Text>
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.contentContainer}>
        <Text style={styles.subheader}>Content Quality</Text>
        <Text style={styles.text}>Score: {result.analysis.contentQuality.score}</Text>
        
        <Text style={styles.sectionTitle}>Suggestions</Text>
        {result.analysis.contentQuality.suggestions.map((suggestion, index) => (
          <Text key={index} style={styles.listItem}>• {suggestion}</Text>
        ))}
      </View>

      <View style={styles.divider} />

      <View style={styles.contentContainer}>
        <Text style={styles.subheader}>Strategy</Text>
        <Text style={styles.sectionTitle}>Target Audience</Text>
        <Text style={styles.text}>{result.analysis.strategy.targetAudience}</Text>
        
        <Text style={styles.sectionTitle}>Content Gaps</Text>
        {result.analysis.strategy.contentGaps.map((gap, index) => (
          <Text key={index} style={styles.listItem}>• {gap}</Text>
        ))}
        
        <Text style={styles.sectionTitle}>Action Items</Text>
        {result.analysis.strategy.actionItems.map((item, index) => (
          <Text key={index} style={styles.listItem}>• {item}</Text>
        ))}
      </View>
    </Page>
  </Document>
);

const EmptyPDFDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>No Content Available</Text>
      <Text style={styles.text}>There is no content available to generate a PDF. Please make sure you have selected valid content for analysis.</Text>
    </Page>
  </Document>
);

interface PDFButtonProps {
  view: 'overall' | 'individual';
  overallStrategy?: OverallStrategy | null;
  result?: AnalysisResult;
  onClose: () => void;
}

export default function PDFButton({ view, overallStrategy, result, onClose }: PDFButtonProps) {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <h3 className="text-red-500 font-semibold mb-4">Error Generating PDF</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setError(null)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Try Again
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="font-semibold mb-4">Generate PDF</h3>
        <p className="text-gray-600 mb-4">Click the button below to download your PDF.</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <PDFDownloadLink
            document={
              view === 'overall' && overallStrategy ? (
                <PDFDocument strategy={overallStrategy} />
              ) : result ? (
                <IndividualPDFDocument result={result} />
              ) : (
                <EmptyPDFDocument />
              )
            }
            fileName={
              view === 'overall'
                ? `overall-strategy-${new Date().toISOString().split('T')[0]}.pdf`
                : `content-analysis-${result?.content.title?.slice(0, 30) || 'analysis'}.pdf`
            }
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            {({ blob, url, loading, error }) => {
              if (error) {
                setError(error.message);
                return null;
              }
              return loading ? 'Preparing Download...' : 'Download PDF';
            }}
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
} 