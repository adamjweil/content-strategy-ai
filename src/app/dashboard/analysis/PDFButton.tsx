import { useState } from 'react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import type { AnalysisResult, OverallStrategy } from '@/types';

// Define styles for PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  subheader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 6,
    marginBottom: 4,
  },
  text: {
    fontSize: 10,
    marginBottom: 3,
    color: '#4B5563',
    lineHeight: 1.3,
  },
  metricRow: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  metricBox: {
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'solid',
  },
  metricLabel: {
    fontSize: 10,
    color: '#6B7280',
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  contentContainer: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'solid',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    marginBottom: 8,
    gap: 4,
  },
  tag: {
    fontSize: 9,
    backgroundColor: '#F3F4F6',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 4,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'solid',
  },
  cardContainer: {
    marginTop: 4,
    marginBottom: 6,
    padding: 8,
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'solid',
  },
  metricsContainer: {
    backgroundColor: '#F0F9FF',
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderStyle: 'solid',
  },
  contentAuditContainer: {
    backgroundColor: '#F5F3FF',
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDD6FE',
    borderStyle: 'solid',
  },
  gapsContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderStyle: 'solid',
  },
  recommendationsContainer: {
    backgroundColor: '#FDF2F8',
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FBCFE8',
    borderStyle: 'solid',
  },
  actionContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderStyle: 'solid',
  },
  seoContainer: {
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderStyle: 'solid',
  },
  strategyContainer: {
    backgroundColor: '#FDF2F8',
    borderRadius: 6,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FBCFE8',
    borderStyle: 'solid',
  },
  scoreBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'solid',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  scoreLabel: {
    fontSize: 10,
    color: '#374151',
    flex: 1,
  },
  scoreValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  twoColumnLayout: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  column: {
    flex: 1,
  },
  bulletList: {
    marginLeft: 12,
  },
  bullet: {
    fontSize: 10,
    marginBottom: 3,
    color: '#4B5563',
  }
});

// Enhanced PDF Document for Overall Strategy
const PDFDocument = ({ strategy }: { strategy: OverallStrategy }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Overall Content Strategy</Text>
      
      {strategy.metrics && (
        <View style={styles.metricsContainer}>
          <View style={styles.metricRow}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Views</Text>
              <Text style={styles.metricValue}>{strategy.metrics.views.toLocaleString()}</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Engagement</Text>
              <Text style={styles.metricValue}>{strategy.metrics.engagementRate}%</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Finish Time</Text>
              <Text style={styles.metricValue}>{strategy.metrics.avgFinishTime}m</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Attention</Text>
              <Text style={styles.metricValue}>{strategy.metrics.attentionTime}m</Text>
            </View>
          </View>
        </View>
      )}

      <View style={styles.twoColumnLayout}>
        <View style={styles.column}>
          <View style={styles.contentAuditContainer}>
            <Text style={styles.subheader}>Content Audit & Audience</Text>
            <Text style={styles.sectionTitle}>Content Types</Text>
            {strategy.contentAudit.contentTypes.map((item, index) => (
              <View key={index} style={styles.cardContainer}>
                <Text style={[styles.text, { fontWeight: 'bold' }]}>{item.type}</Text>
                <Text style={styles.text}>{item.frequency} • {item.effectiveness}</Text>
              </View>
            ))}
            <Text style={styles.sectionTitle}>Primary Audiences</Text>
            <View style={styles.tagContainer}>
              {strategy.audienceAnalysis.primaryAudiences.map((audience, index) => (
                <Text key={index} style={styles.tag}>{audience}</Text>
              ))}
            </View>
          </View>

          <View style={styles.gapsContainer}>
            <Text style={styles.subheader}>Content Gaps</Text>
            {strategy.contentGaps.map((gap, index) => (
              <View key={index} style={styles.cardContainer}>
                <Text style={[styles.text, { fontWeight: 'bold' }]}>{gap.topic}</Text>
                <Text style={styles.text}>{gap.priority} • {gap.opportunity}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.column}>
          <View style={styles.recommendationsContainer}>
            <Text style={styles.subheader}>Recommendations</Text>
            <Text style={styles.text}>{strategy.recommendations.contentMix}</Text>
            <View style={styles.tagContainer}>
              {strategy.recommendations.topicClusters.map((topic, index) => (
                <Text key={index} style={styles.tag}>{topic}</Text>
              ))}
            </View>
          </View>

          <View style={styles.actionContainer}>
            <Text style={styles.subheader}>Action Plan</Text>
            {strategy.actionPlan.map((action, index) => (
              <View key={index} style={styles.cardContainer}>
                <Text style={[styles.text, { fontWeight: 'bold' }]}>{action.action}</Text>
                <Text style={styles.text}>{action.timeline} • {action.expectedImpact}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

// Enhanced PDF Document for Individual Analysis
const IndividualPDFDocument = ({ result }: { result: AnalysisResult }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>{result.content.title}</Text>
      
      <View style={styles.metricsContainer}>
        <View style={styles.metricRow}>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Words</Text>
            <Text style={styles.metricValue}>{result.content.wordCount}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Views</Text>
            <Text style={styles.metricValue}>{result.analytics.views}</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Engagement</Text>
            <Text style={styles.metricValue}>{result.analytics.engagementRate}%</Text>
          </View>
          <View style={styles.metricBox}>
            <Text style={styles.metricLabel}>Attention</Text>
            <Text style={styles.metricValue}>{result.analytics.attentionTimeMinutes}m</Text>
          </View>
        </View>
      </View>

      <View style={styles.twoColumnLayout}>
        <View style={styles.column}>
          <View style={styles.contentAuditContainer}>
            <Text style={styles.subheader}>Content Summary</Text>
            <Text style={styles.text}>{result.analysis.summary.overview}</Text>
            
            <View style={styles.twoColumnLayout}>
              <View style={styles.column}>
                <Text style={styles.sectionTitle}>Strengths</Text>
                {result.analysis.summary.strengths.map((strength, index) => (
                  <Text key={index} style={styles.text}>• {strength}</Text>
                ))}
              </View>
              <View style={styles.column}>
                <Text style={styles.sectionTitle}>Weaknesses</Text>
                {result.analysis.summary.weaknesses.map((weakness, index) => (
                  <Text key={index} style={styles.text}>• {weakness}</Text>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.seoContainer}>
            <Text style={styles.subheader}>SEO & Quality</Text>
            <View style={styles.twoColumnLayout}>
              <View style={styles.column}>
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreLabel}>SEO Score</Text>
                  <Text style={styles.scoreValue}>{result.analysis.seoAnalysis.score}</Text>
                </View>
                {result.analysis.seoAnalysis.recommendations.map((rec, index) => (
                  <Text key={index} style={styles.text}>• {rec}</Text>
                ))}
              </View>
              <View style={styles.column}>
                <View style={styles.scoreBox}>
                  <Text style={styles.scoreLabel}>Quality Score</Text>
                  <Text style={styles.scoreValue}>{result.analysis.contentQuality.score}</Text>
                </View>
                {result.analysis.contentQuality.suggestions.map((sug, index) => (
                  <Text key={index} style={styles.text}>• {sug}</Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.column}>
          <View style={styles.strategyContainer}>
            <Text style={styles.subheader}>Strategy</Text>
            <Text style={styles.sectionTitle}>Target Audience</Text>
            <Text style={styles.text}>{result.analysis.strategy.targetAudience}</Text>
            
            <Text style={styles.sectionTitle}>Content Gaps</Text>
            {result.analysis.strategy.contentGaps.map((gap, index) => (
              <Text key={index} style={styles.text}>• {gap}</Text>
            ))}
            
            <Text style={styles.sectionTitle}>Action Items</Text>
            {result.analysis.strategy.actionItems.map((item, index) => (
              <Text key={index} style={styles.text}>• {item}</Text>
            ))}
          </View>
        </View>
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
            {({ loading, error }) => {
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