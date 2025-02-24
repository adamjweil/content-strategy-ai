"use client";

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ResultCard } from '@/components/ResultCard';

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [urls, setUrls] = useState<string[]>(['']);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [activeResultIndex, setActiveResultIndex] = useState<number>(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const addUrlField = () => {
    setUrls([...urls, '']);
  };

  const removeUrlField = (index: number) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls.length ? newUrls : ['']);
  };

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const analyzeContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnalyzing(true);
    setResults([]);
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: urls.filter(url => url.trim()) }),
      });
      
      const data = await response.json();
      setResults(data.results);
      setActiveResultIndex(0);
    } catch (error) {
      console.error('Error analyzing content:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Content Strategy AI</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-600">{user?.email}</span>
              <button
                onClick={() => logout()}
                className="text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <form onSubmit={analyzeContent} className="space-y-4">
            <div className="space-y-3">
              {urls.map((url, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => updateUrl(index, e.target.value)}
                    placeholder="Enter URL to analyze..."
                    className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                  {urls.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeUrlField(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex gap-4">
              <button
                type="button"
                onClick={addUrlField}
                className="flex items-center gap-2 px-4 py-2 text-blue-500 border border-blue-500 rounded-lg hover:bg-blue-50"
              >
                <PlusIcon className="w-5 h-5" />
                Add Another URL
              </button>
              
              <button
                type="submit"
                disabled={analyzing}
                className="flex-1 bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                {analyzing ? 'Analyzing...' : 'Analyze Content'}
              </button>
            </div>
          </form>

          {results.length > 0 && (
            <div className="space-y-6">
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 