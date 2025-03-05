"use client";

import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, collection, query, where, getDocs, addDoc, orderBy, serverTimestamp } from 'firebase/firestore';
import { ResultCard } from '@/components/ResultCard';
import { OverallStrategyCard } from '@/components/OverallStrategyCard';
import { PrintableResultCard } from '@/components/PrintableResultCard';
import { PrintableStrategyCard } from '@/components/PrintableStrategyCard';
import type { SavedURL, AnalysisResult, Analysis } from '@/types';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// Define the OverallStrategy type
type OverallStrategy = {
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
  metricsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    padding: 8,
    borderRadius: 6,
  },
  metricLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  metricValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  contentRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#F3F4F6',
    padding: '2 6',
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 4,
  },
  contentGapCard: {
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
  },
  actionCard: {
    backgroundColor: '#F0FDF4',
    padding: 10,
    borderRadius: 6,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionNumber: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#BBF7D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  text: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  smallText: {
    fontSize: 8,
    color: '#6B7280',
  },
  sectionContainer: {
    marginBottom: 12,
    breakInside: 'avoid',
  },
});

// PDF Document component
const PDFDocument = ({ strategy }: { strategy: OverallStrategy }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Overall Content Strategy</Text>

      {/* Metrics Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.metricsContainer}>
          <View style={[styles.metricCard, { backgroundColor: '#EFF6FF' }]}>
            <Text style={[styles.metricLabel, { color: '#1E40AF' }]}>Views</Text>
            <Text style={[styles.metricValue, { color: '#1E3A8A' }]}>{strategy.metrics?.views.toLocaleString()}</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: '#F0FDF4' }]}>
            <Text style={[styles.metricLabel, { color: '#166534' }]}>Engagement Rate</Text>
            <Text style={[styles.metricValue, { color: '#14532D' }]}>{strategy.metrics?.engagementRate}%</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: '#F5F3FF' }]}>
            <Text style={[styles.metricLabel, { color: '#5B21B6' }]}>Avg. Finish Time</Text>
            <Text style={[styles.metricValue, { color: '#4C1D95' }]}>{strategy.metrics?.avgFinishTime}s</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: '#FFFBEB' }]}>
            <Text style={[styles.metricLabel, { color: '#B45309' }]}>Avg. Attention Span</Text>
            <Text style={[styles.metricValue, { color: '#92400E' }]}>{strategy.metrics?.avgAttentionSpan}s</Text>
          </View>
          <View style={[styles.metricCard, { backgroundColor: '#EEF2FF' }]}>
            <Text style={[styles.metricLabel, { color: '#3730A3' }]}>Attention Time</Text>
            <Text style={[styles.metricValue, { color: '#312E81' }]}>{strategy.metrics?.attentionTime}m</Text>
          </View>
        </View>
      </View>

      {/* Content Audit Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Content Audit</Text>
        <View style={styles.contentRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.text}>Content Types</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
              {strategy.contentAudit.contentTypes.map((type, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.text}>{type.type}</Text>
                  <Text style={styles.smallText}>({type.frequency}, {type.effectiveness})</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.text}>Writing Styles</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 }}>
              {strategy.contentAudit.writingStyles.map((style, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.text}>{style.style}</Text>
                  <Text style={styles.smallText}>({style.usage}, {style.impact})</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Content Gaps Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Content Gaps</Text>
        {strategy.contentGaps.map((gap, index) => (
          <View key={index} style={styles.contentGapCard}>
            <Text style={[styles.text, { color: '#92400E', fontWeight: 'bold' }]}>{gap.topic}</Text>
            <Text style={[styles.smallText, { color: '#B45309' }]}>{gap.opportunity} • {gap.priority}</Text>
          </View>
        ))}
      </View>

      {/* Action Plan Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Action Plan</Text>
        {strategy.actionPlan.map((action, index) => (
          <View key={index} style={styles.actionCard}>
            <View style={styles.actionNumber}>
              <Text style={[styles.text, { color: '#166534' }]}>{index + 1}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.text, { color: '#166534' }]}>{action.action}</Text>
              <Text style={[styles.smallText, { color: '#166534', marginTop: 5 }]}>
                {action.timeline} • {action.expectedImpact}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Audience Analysis Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Audience Analysis</Text>
        <View style={[styles.contentGapCard, { backgroundColor: '#F0F9FF' }]}>
          <Text style={[styles.text, { color: '#0C4A6E', fontWeight: 'bold' }]}>Primary Audiences</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
            {strategy.audienceAnalysis.primaryAudiences.map((audience, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: '#E0F2FE' }]}>
                <Text style={[styles.text, { color: '#0C4A6E' }]}>{audience}</Text>
              </View>
            ))}
          </View>
          
          <Text style={[styles.text, { color: '#0C4A6E', fontWeight: 'bold', marginTop: 8 }]}>Audience Needs</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
            {strategy.audienceAnalysis.audienceNeeds.map((need, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: '#E0F2FE' }]}>
                <Text style={[styles.text, { color: '#0C4A6E' }]}>{need}</Text>
              </View>
            ))}
          </View>
          
          <Text style={[styles.text, { color: '#0C4A6E', fontWeight: 'bold', marginTop: 8 }]}>Engagement Patterns</Text>
          <Text style={[styles.text, { color: '#0C4A6E', marginTop: 2 }]}>{strategy.audienceAnalysis.engagementPatterns}</Text>
        </View>
      </View>

      {/* Recommendations Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <View style={[styles.contentGapCard, { backgroundColor: '#F5F3FF' }]}>
          <Text style={[styles.text, { color: '#5B21B6', fontWeight: 'bold' }]}>Content Mix</Text>
          <Text style={[styles.text, { color: '#5B21B6', marginTop: 2 }]}>{strategy.recommendations.contentMix}</Text>
          
          <Text style={[styles.text, { color: '#5B21B6', fontWeight: 'bold', marginTop: 8 }]}>Topic Clusters</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 4 }}>
            {strategy.recommendations.topicClusters.map((topic, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: '#EDE9FE' }]}>
                <Text style={[styles.text, { color: '#5B21B6' }]}>{topic}</Text>
              </View>
            ))}
          </View>
          
          <Text style={[styles.text, { color: '#5B21B6', fontWeight: 'bold', marginTop: 8 }]}>Content Calendar</Text>
          {strategy.recommendations.contentCalendar.map((item, index) => (
            <View key={index} style={{ marginTop: 4 }}>
              <Text style={[styles.text, { color: '#5B21B6' }]}>
                {item.contentType} • {item.frequency} • {item.focus}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Brand Voice Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Brand Voice</Text>
        <View style={[styles.contentGapCard, { backgroundColor: '#FDF2F8' }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={[styles.text, { color: '#9D174D', fontWeight: 'bold' }]}>Current Tone</Text>
            <Text style={[styles.text, { color: '#9D174D' }]}>Consistency: {strategy.brandVoice.consistencyScore}</Text>
          </View>
          <Text style={[styles.text, { color: '#9D174D', marginTop: 2 }]}>{strategy.brandVoice.currentTone}</Text>
          
          <Text style={[styles.text, { color: '#9D174D', fontWeight: 'bold', marginTop: 8 }]}>Suggested Improvements</Text>
          {strategy.brandVoice.improvements.map((improvement, index) => (
            <Text key={index} style={[styles.text, { color: '#9D174D', marginTop: 2 }]}>• {improvement}</Text>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

// Individual PDF Document component
const IndividualPDFDocument = ({ result }: { result: AnalysisResult }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>{result.content.title}</Text>

      {/* Content Overview */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Content Overview</Text>
        <View style={[styles.contentGapCard, { backgroundColor: '#F0F9FF' }]}>
          <Text style={[styles.text, { color: '#0C4A6E', fontWeight: 'bold' }]}>URL</Text>
          <Text style={[styles.text, { color: '#0C4A6E' }]}>{result.url}</Text>
          
          <Text style={[styles.text, { color: '#0C4A6E', fontWeight: 'bold', marginTop: 8 }]}>Word Count</Text>
          <Text style={[styles.text, { color: '#0C4A6E' }]}>{result.content.wordCount} words</Text>
        </View>
      </View>

      {/* Analysis Summary */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Analysis Summary</Text>
        <View style={[styles.contentGapCard, { backgroundColor: '#F5F3FF' }]}>
          <Text style={[styles.text, { color: '#5B21B6', fontWeight: 'bold' }]}>Overview</Text>
          <Text style={[styles.text, { color: '#5B21B6' }]}>{result.analysis.summary.overview}</Text>

          <Text style={[styles.text, { color: '#5B21B6', fontWeight: 'bold', marginTop: 8 }]}>Strengths</Text>
          {result.analysis.summary.strengths.map((strength, index) => (
            <Text key={index} style={[styles.text, { color: '#5B21B6', marginTop: 2 }]}>• {strength}</Text>
          ))}

          <Text style={[styles.text, { color: '#5B21B6', fontWeight: 'bold', marginTop: 8 }]}>Weaknesses</Text>
          {result.analysis.summary.weaknesses.map((weakness, index) => (
            <Text key={index} style={[styles.text, { color: '#5B21B6', marginTop: 2 }]}>• {weakness}</Text>
          ))}
        </View>
      </View>

      {/* SEO Analysis */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>SEO Analysis</Text>
        <View style={[styles.contentGapCard, { backgroundColor: '#EFF6FF' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={[styles.text, { color: '#1E40AF', fontWeight: 'bold' }]}>Score: </Text>
            <Text style={[styles.text, { color: '#1E40AF' }]}>{result.analysis.seoAnalysis.score}</Text>
          </View>
          
          <Text style={[styles.text, { color: '#1E40AF', fontWeight: 'bold' }]}>Recommendations</Text>
          {result.analysis.seoAnalysis.recommendations.map((rec, index) => (
            <Text key={index} style={[styles.text, { color: '#1E40AF', marginTop: 2 }]}>• {rec}</Text>
          ))}
        </View>
      </View>

      {/* Content Quality */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Content Quality</Text>
        <View style={[styles.contentGapCard, { backgroundColor: '#F0FDF4' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={[styles.text, { color: '#166534', fontWeight: 'bold' }]}>Score: </Text>
            <Text style={[styles.text, { color: '#166534' }]}>{result.analysis.contentQuality.score}</Text>
          </View>
          
          <Text style={[styles.text, { color: '#166534', fontWeight: 'bold' }]}>Suggestions</Text>
          {result.analysis.contentQuality.suggestions.map((suggestion, index) => (
            <Text key={index} style={[styles.text, { color: '#166534', marginTop: 2 }]}>• {suggestion}</Text>
          ))}
        </View>
      </View>

      {/* Content Strategy */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Content Strategy</Text>
        <View style={[styles.contentGapCard, { backgroundColor: '#FDF2F8' }]}>
          <Text style={[styles.text, { color: '#9D174D', fontWeight: 'bold' }]}>Target Audience</Text>
          <Text style={[styles.text, { color: '#9D174D', marginTop: 2 }]}>{result.analysis.strategy.targetAudience}</Text>

          <Text style={[styles.text, { color: '#9D174D', fontWeight: 'bold', marginTop: 8 }]}>Content Gaps</Text>
          {result.analysis.strategy.contentGaps.map((gap: string, index: number) => (
            <Text key={index} style={[styles.text, { color: '#9D174D', marginTop: 2 }]}>• {gap}</Text>
          ))}

          <Text style={[styles.text, { color: '#9D174D', fontWeight: 'bold', marginTop: 8 }]}>Action Items</Text>
          {result.analysis.strategy.actionItems.map((item: string, index: number) => (
            <Text key={index} style={[styles.text, { color: '#9D174D', marginTop: 2 }]}>• {item}</Text>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

// Move PDF Document components outside the main component
const EmptyPDFDocument = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text>No content available</Text>
    </Page>
  </Document>
);

// Separate PDF Download Button Component
const PDFDownloadButton = ({ 
  view, 
  overallStrategy, 
  result, 
  fileName 
}: { 
  view: 'overall' | 'individual';
  overallStrategy?: OverallStrategy | null;
  result?: AnalysisResult;
  fileName: string;
}) => {
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <button disabled className="px-4 py-2 text-gray-400 border border-gray-400 rounded-lg flex items-center gap-2 opacity-50 cursor-not-allowed">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Loading...
      </button>
    );
  }

  if (error) {
    return (
      <button
        className="px-4 py-2 text-red-500 border border-red-500 rounded-lg flex items-center gap-2"
        onClick={() => setError(null)}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Error: {error}
      </button>
    );
  }

  return (
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
      fileName={fileName}
      className="px-4 py-2 text-green-500 border border-green-500 rounded-lg hover:bg-green-50 flex items-center gap-2"
    >
      {({ blob, url, loading, error }) => {
        if (error) {
          setError(error.message);
          return null;
        }
        return loading ? (
          <>
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating PDF...
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </>
        );
      }}
    </PDFDownloadLink>
  );
};

// Separate PDF imports into a new component
const PDFButton = lazy(() => import('./PDFButton'));

export default function AnalysisPage() {
  const { user } = useAuth();
  const [allAnalyses, setAllAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>('');
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [overallStrategy, setOverallStrategy] = useState<OverallStrategy | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const [view, setView] = useState<'individual' | 'overall'>('overall');
  const [showPDF, setShowPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all analyses for the user
  useEffect(() => {
    if (!user) return;

    const fetchAnalyses = async () => {
      const analysesQuery = query(
        collection(db, 'analyses'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(analysesQuery);
      const analyses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Analysis[];

      setAllAnalyses(analyses);

      // If there are analyses and none is selected, select the most recent one
      if (analyses.length > 0 && !selectedAnalysisId) {
        setSelectedAnalysisId(analyses[0].id);
        setResults(analyses[0].results);
        setOverallStrategy(analyses[0].overallStrategy);
      }
    };

    fetchAnalyses();
  }, [user]);

  // Handle new analysis requests
  useEffect(() => {
    const urlsToAnalyze = localStorage.getItem('urlsToAnalyze');
    if (!urlsToAnalyze || !user) return;

    const fetchAndAnalyze = async () => {
      setLoading(true);
      try {
        const urlIds = JSON.parse(urlsToAnalyze);
        const urls = await Promise.all(
          urlIds.map(async (id: string) => {
            const docRef = doc(db, 'urls', id);
            const docSnap = await getDoc(docRef);
            return { id, ...docSnap.data() } as SavedURL;
          })
        );

        // Check for existing analysis
        const analysisQuery = query(
          collection(db, 'analyses'),
          where('userId', '==', user.uid),
          where('urlIds', '==', urlIds.sort()) // Sort to ensure consistent comparison
        );
        
        const existingAnalyses = await getDocs(analysisQuery);
        
        if (!existingAnalyses.empty) {
          // Use existing analysis
          const analysis = existingAnalyses.docs[0].data();
          setResults(analysis.results);
          setOverallStrategy(analysis.overallStrategy);
        } else {
          // Perform new analysis
          const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ urls: urls.map(u => u.url) }),
          });

          const data = await response.json();
          
          // Save analysis to Firestore
          await addDoc(collection(db, 'analyses'), {
            userId: user.uid,
            urlIds: urlIds.sort(),
            urls: urls.map(u => u.url),
            results: data.results,
            overallStrategy: data.overallStrategy,
            createdAt: new Date().toISOString()
          });

          setResults(data.results);
          setOverallStrategy(data.overallStrategy);
        }

        // After saving new analysis, refresh the analyses list
        const analysesQuery = query(
          collection(db, 'analyses'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        const snapshot = await getDocs(analysesQuery);
        const analyses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Analysis[];

        setAllAnalyses(analyses);
        if (analyses.length > 0) {
          setSelectedAnalysisId(analyses[0].id);
        }
      } catch (error) {
        console.error('Error analyzing content:', error);
      } finally {
        setLoading(false);
        localStorage.removeItem('urlsToAnalyze');
      }
    };

    fetchAndAnalyze();
  }, [user]);

  // Handle analysis selection
  const handleAnalysisChange = (analysisId: string) => {
    const analysis = allAnalyses.find(a => a.id === analysisId);
    if (analysis) {
      setSelectedAnalysisId(analysisId);
      setResults(analysis.results);
      setOverallStrategy(analysis.overallStrategy);
      setActiveResultIndex(0);
    }
  };

  const forceNewAnalysis = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const urlIds = results.map(result => {
        const url = new URL(result.url);
        return url.pathname.split('/').pop() || url.hostname;
      });

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls: results.map(r => r.url) }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to analyze content');
      }

      const data = await response.json();
      
      if (data.failedResults?.length > 0) {
        console.warn('Some analyses failed:', data.failedResults);
      }

      // Update the UI with successful results
      if (data.results) {
        setResults(data.results);
        setOverallStrategy(data.overallStrategy);
        setActiveResultIndex(0);
        
        // Save the analysis to Firestore
        const analysisRef = await addDoc(collection(db, 'analyses'), {
          userId: user.uid,
          results: data.results,
          overallStrategy: data.overallStrategy,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        setSelectedAnalysisId(analysisRef.id);
      }
    } catch (error) {
      console.error('Analysis error:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {allAnalyses.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="space-x-2">
              <button
                onClick={() => {
                  setView('overall');
                  setShowPDF(false);
                }}
                className={`px-4 py-2 rounded-lg ${
                  view === 'overall'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Overall Strategy
              </button>
              <button
                onClick={() => {
                  setView('individual');
                  setShowPDF(false);
                }}
                className={`px-4 py-2 rounded-lg ${
                  view === 'individual'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Individual Analysis
              </button>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={selectedAnalysisId}
                onChange={(e) => {
                  handleAnalysisChange(e.target.value);
                  setShowPDF(false);
                }}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {allAnalyses.map((analysis) => (
                  <option key={analysis.id} value={analysis.id}>
                    {new Date(analysis.createdAt).toLocaleDateString()} - {analysis.urls?.length || 0} URLs
                  </option>
                ))}
              </select>

              <button
                onClick={forceNewAnalysis}
                disabled={loading}
                className="px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50"
              >
                Refresh Analysis
              </button>

              {(overallStrategy || (results && results[activeResultIndex])) && (
                <button
                  onClick={() => setShowPDF(true)}
                  className="px-4 py-2 text-green-500 border border-green-500 rounded-lg hover:bg-green-50 flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Generate PDF
                </button>
              )}
            </div>
          </div>

          {showPDF && (
            <Suspense fallback={<div>Loading PDF generator...</div>}>
              <PDFButton
                view={view}
                overallStrategy={overallStrategy}
                result={results?.[activeResultIndex]}
                onClose={() => setShowPDF(false)}
              />
            </Suspense>
          )}

          <div id="export-content">
            {view === 'individual' ? (
              <>
                {results && results.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {results.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setActiveResultIndex(index);
                          setShowPDF(false);
                        }}
                        className={`px-4 py-2 rounded-lg whitespace-nowrap text-xs ${
                          activeResultIndex === index
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                        title={result.content?.title}
                      >
                        {result.content?.title 
                          ? (result.content.title.length > 25 
                              ? `${result.content.title.substring(0, 25)}...`
                              : result.content.title)
                          : 'Untitled'}
                      </button>
                    ))}
                  </div>
                )}
                {results && results[activeResultIndex] ? (
                  <ResultCard result={results[activeResultIndex]} />
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No analysis result available for this selection.</p>
                  </div>
                )}
              </>
            ) : (
              overallStrategy ? (
                <OverallStrategyCard strategy={overallStrategy} />
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">No overall strategy available.</p>
                </div>
              )
            )}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No analysis results available. Select URLs to analyze from the URLs tab.</p>
        </div>
      )}
    </div>
  );
} 