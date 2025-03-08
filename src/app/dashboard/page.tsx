"use client";

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import type { SavedURL } from '@/types';

export default function URLsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [newUrl, setNewUrl] = useState('');
  const [selectedUrls, setSelectedUrls] = useState<string[]>([]);

  const [urls, loading, error] = useCollection(
    query(
      collection(db, 'urls'),
      where('userId', '==', user?.uid),
      orderBy('createdAt', 'desc')
    )
  );

  const addUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim() || !user) return;

    await addDoc(collection(db, 'urls'), {
      url: newUrl,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    });

    setNewUrl('');
  };

  const deleteUrl = async (urlId: string) => {
    await deleteDoc(doc(db, 'urls', urlId));
  };

  const analyzeSelected = () => {
    if (selectedUrls.length === 0) return;
    
    // Get the actual URLs from the selected IDs
    const urlsToAnalyze = urls?.docs
      .filter(doc => selectedUrls.includes(doc.id))
      .map(doc => doc.data().url as string) || [];
    
    // Store actual URLs in localStorage for the analysis page
    localStorage.setItem('urlsToAnalyze', JSON.stringify(urlsToAnalyze));
    router.push('/dashboard/analysis');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add New URL</h2>
        <form onSubmit={addUrl} className="flex gap-4">
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="Enter URL to track..."
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add URL
          </button>
        </form>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Saved URLs</h2>
          <button
            onClick={analyzeSelected}
            disabled={selectedUrls.length === 0}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors disabled:bg-green-300"
          >
            Analyze Selected
          </button>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        
        <div className="space-y-4">
          {urls?.docs.map((doc) => {
            const url = doc.data() as SavedURL;
            return (
              <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedUrls.includes(doc.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUrls(prev => [...prev, doc.id]);
                      } else {
                        setSelectedUrls(prev => prev.filter(id => id !== doc.id));
                      }
                    }}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <a href={url.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {url.url}
                  </a>
                </div>
                <button
                  onClick={() => deleteUrl(doc.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 