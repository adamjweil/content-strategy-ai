"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import { PlusIcon, XMarkIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
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
    
    // Store selected URLs in localStorage for the analysis page
    localStorage.setItem('urlsToAnalyze', JSON.stringify(selectedUrls));
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
        
        <div className="space-y-3">
          {urls?.docs.map((doc) => {
            const url = { id: doc.id, ...doc.data() } as SavedURL;
            return (
              <div key={url.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedUrls.includes(url.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedUrls([...selectedUrls, url.id]);
                    } else {
                      setSelectedUrls(selectedUrls.filter(id => id !== url.id));
                    }
                  }}
                  className="h-5 w-5 text-blue-500"
                />
                <span className="flex-1">{url.url}</span>
                <button
                  onClick={() => deleteUrl(url.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-lg"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 