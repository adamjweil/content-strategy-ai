"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase/config';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import type { Analysis, ContentItem } from '@/types';
import { MonthView } from '@/components/calendar/MonthView';
import { WeekView } from '@/components/calendar/WeekView';

interface CalendarItem extends ContentItem {
  date: Date;
}

export default function CalendarPage() {
  const { user } = useAuth();
  const [view, setView] = useState<'month' | 'week'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [contentCalendar, setContentCalendar] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchLatestAnalysis = async () => {
      try {
        setLoading(true);
        const analysesQuery = query(
          collection(db, 'analyses'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(1)
        );

        const snapshot = await getDocs(analysesQuery);
        if (!snapshot.empty) {
          const analysis = snapshot.docs[0].data() as Analysis;
          const calendar = generateContentCalendar(analysis);
          setContentCalendar(calendar);
        }
      } catch (error) {
        console.error('Error fetching analysis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestAnalysis();
  }, [user]);

  const generateContentCalendar = (analysis: Analysis): CalendarItem[] => {
    if (!analysis.overallStrategy) return [];

    const { contentMix, topicClusters, contentCalendar } = analysis.overallStrategy.recommendations;
    const { primaryAudiences, audienceNeeds } = analysis.overallStrategy.audienceAnalysis;
    
    // Generate 4 weeks of content based on strategy
    const calendar: CalendarItem[] = [];
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    for (let week = 0; week < 4; week++) {
      contentCalendar.forEach((item) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + (week * 7) + Math.floor(Math.random() * 7)); // Spread content throughout the week

        // Generate title and description based on strategy
        const topic = topicClusters[Math.floor(Math.random() * topicClusters.length)];
        const audience = primaryAudiences[Math.floor(Math.random() * primaryAudiences.length)];
        const need = audienceNeeds[Math.floor(Math.random() * audienceNeeds.length)];

        calendar.push({
          id: `${week}-${item.contentType}-${Date.now()}`,
          title: generateTitle(topic, item.contentType, audience),
          description: generateDescription(topic, need, item.focus),
          contentType: item.contentType,
          date: date,
          audience: audience,
          focus: item.focus
        });
      });
    }

    return calendar;
  };

  const generateTitle = (topic: string, contentType: string, audience: string): string => {
    const titleTemplates = [
      `The Ultimate Guide to ${topic} for ${audience}`,
      `How ${audience} Can Master ${topic}`,
      `${topic}: A Complete ${contentType} Guide`,
      `${topic} Strategies That Work for ${audience}`,
      `Why ${audience} Should Care About ${topic}`,
    ];
    return titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
  };

  const generateDescription = (topic: string, need: string, focus: string): string => {
    return `A comprehensive ${focus} that addresses ${need} by exploring ${topic}. This content piece will provide valuable insights and actionable strategies for our audience.`;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Content Calendar</h1>
        <div className="flex gap-4">
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 rounded ${
              view === 'month' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Month View
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 rounded ${
              view === 'week' ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            Week View
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {view === 'month' ? (
            <MonthView 
              contentCalendar={contentCalendar}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
            />
          ) : (
            <WeekView
              contentCalendar={contentCalendar}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
            />
          )}
        </>
      )}
    </div>
  );
} 