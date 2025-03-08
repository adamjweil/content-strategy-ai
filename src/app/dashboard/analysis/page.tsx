"use client";

import { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, addDoc, orderBy } from 'firebase/firestore';
import OverallStrategyCard from '@/components/OverallStrategyCard';
import type { Analysis, AnalysisResult } from '@/types';

// Separate PDF imports into a new component
const PDFButton = lazy(() => import('./PDFButton'));

export default function AnalysisPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);
  const [showPDFModal, setShowPDFModal] = useState(false);

  const fetchAnalyses = useCallback(async () => {
    try {
      setLoading(true);
      const analysesRef = collection(db, 'analyses');
      const q = query(
        analysesRef,
        where('userId', '==', user?.uid),
        orderBy('createdAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const analysesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Analysis[];

      setAnalyses(analysesData);
      if (analysesData.length > 0) {
        setSelectedAnalysis(analysesData[0]);
      }
    } catch (err) {
      console.error('Error fetching analyses:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const fetchAndAnalyze = useCallback(async () => {
    try {
      setLoading(true);
      const urlsToAnalyze = localStorage.getItem('urlsToAnalyze');
      if (!urlsToAnalyze) return;

      const urls = JSON.parse(urlsToAnalyze);
      console.log('Attempting to analyze URLs:', urls);

      // Define the API URL explicitly
      const apiUrl = 'https://us-central1-content-strategy-fa44b.cloudfunctions.net/analyze';
      console.log('Making request to:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ urls }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Raw error response:', errorText);
        
        let errorMessage = response.statusText;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.error || errorData.message || response.statusText;
        } catch {
          // If the error response isn't JSON, use the raw text
          errorMessage = errorText.slice(0, 200); // Limit length of error message
        }
        
        console.error('Analysis API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorMessage
        });
        throw new Error(`Analysis failed: ${errorMessage}`);
      }

      let data;
      try {
        data = await response.json();
      } catch {
        console.error('Failed to parse response');
        throw new Error('Invalid response from analysis server');
      }

      console.log('Analysis success data:', data);
      
      if (!data || !data.success) {
        throw new Error('Analysis completed but returned no results');
      }

      const newAnalysis: Analysis = {
        id: '',  // Will be set after addDoc
        userId: user?.uid || '',
        urlIds: urls,
        urls: data.results.map((r: AnalysisResult) => r.url),
        results: data.results,
        overallStrategy: data.overallStrategy,
        createdAt: new Date().toISOString(),
      };

      const analysisDoc = await addDoc(collection(db, 'analyses'), newAnalysis);
      newAnalysis.id = analysisDoc.id;

      setAnalyses(prev => [newAnalysis, ...prev]);
      setSelectedAnalysis(newAnalysis);
    } catch (err) {
      console.error('Error analyzing content:', err);
    } finally {
      setLoading(false);
      localStorage.removeItem('urlsToAnalyze');
    }
  }, [user?.uid]);

  useEffect(() => {
    if (user) {
      fetchAnalyses();
    }
  }, [user, fetchAnalyses]);

  // Add new useEffect to check for URLs to analyze
  useEffect(() => {
    const checkAndAnalyzeUrls = async () => {
      const urlsToAnalyze = localStorage.getItem('urlsToAnalyze');
      if (urlsToAnalyze && !loading) {
        await fetchAndAnalyze();
      }
    };
    
    checkAndAnalyzeUrls();
  }, [loading, fetchAndAnalyze]);

  const handleAnalysisChange = (analysisId: string) => {
    const analysis = analyses.find(a => a.id === analysisId);
    if (analysis) {
      setSelectedAnalysis(analysis);
    }
  };

  const forceNewAnalysis = async () => {
    await fetchAndAnalyze();
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
      {analyses.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <div className="space-x-2">
              <button
                onClick={() => {
                  setShowPDFModal(false);
                }}
                className={`px-4 py-2 rounded-lg ${
                  selectedAnalysis ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {selectedAnalysis ? 'Overall Strategy' : 'Select Analysis'}
              </button>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={selectedAnalysis?.id}
                onChange={(e) => {
                  handleAnalysisChange(e.target.value);
                  setShowPDFModal(false);
                }}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {analyses.map((analysis) => (
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

              {selectedAnalysis && (
                <button
                  onClick={() => setShowPDFModal(true)}
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

          {showPDFModal && (
            <Suspense fallback={<div>Loading PDF generator...</div>}>
              <PDFButton
                view="overall"
                overallStrategy={selectedAnalysis?.overallStrategy}
                result={selectedAnalysis?.results?.[0]}
                onClose={() => setShowPDFModal(false)}
              />
            </Suspense>
          )}

          <div id="export-content">
            {selectedAnalysis ? (
              <>
                <OverallStrategyCard strategy={selectedAnalysis.overallStrategy} />
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No analysis result available for this selection.</p>
              </div>
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