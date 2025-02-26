"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, collection, query, where, getDocs, addDoc, orderBy } from 'firebase/firestore';
import { ResultCard } from '@/components/ResultCard';
import { OverallStrategyCard } from '@/components/OverallStrategyCard';
import type { SavedURL, AnalysisResult, Analysis } from '@/types';

export default function AnalysisPage() {
  const { user } = useAuth();
  const [allAnalyses, setAllAnalyses] = useState<Analysis[]>([]);
  const [selectedAnalysisId, setSelectedAnalysisId] = useState<string>('');
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const [overallStrategy, setOverallStrategy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeResultIndex, setActiveResultIndex] = useState(0);
  const [view, setView] = useState<'individual' | 'overall'>('overall');

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

      const data = await response.json();
      
      // Save new analysis to Firestore
      await addDoc(collection(db, 'analyses'), {
        userId: user.uid,
        urlIds: urlIds.sort(),
        urls: results.map(r => r.url),
        results: data.results,
        overallStrategy: data.overallStrategy,
        createdAt: new Date().toISOString()
      });

      setResults(data.results);
      setOverallStrategy(data.overallStrategy);
    } catch (error) {
      console.error('Error analyzing content:', error);
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
                onClick={() => setView('overall')}
                className={`px-4 py-2 rounded-lg ${
                  view === 'overall'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                Overall Strategy
              </button>
              <button
                onClick={() => setView('individual')}
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
                onChange={(e) => handleAnalysisChange(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {allAnalyses.map((analysis) => (
                  <option key={analysis.id} value={analysis.id}>
                    {new Date(analysis.createdAt).toLocaleDateString()} - {analysis.urls.length} URLs
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
            </div>
          </div>

          {view === 'individual' ? (
            <>
              {results.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {results.map((result, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveResultIndex(index)}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                        activeResultIndex === index
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {new URL(result.url).hostname}
                    </button>
                  ))}
                </div>
              )}
              <ResultCard result={results[activeResultIndex]} />
            </>
          ) : (
            overallStrategy && <OverallStrategyCard strategy={overallStrategy} />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No analysis results available. Select URLs to analyze from the URLs tab.</p>
        </div>
      )}
    </div>
  );
} 