"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase/config';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import type { Analysis, ContentItem } from '@/types';
import { MonthView } from '@/components/calendar/MonthView';
import { WeekView } from '@/components/calendar/WeekView';
import { ContentPreferences } from '@/components/calendar/ContentPreferences';

interface CalendarItem extends ContentItem {
  date: Date;
}

// Add helper functions for content generation
const generateContentIdea = (
  type: string,
  focus: string,
  audience: string,
  contentGaps: Array<{ topic: string, opportunity: string }>,
  writingStyles: Array<{ style: string, impact: string }>,
  audienceNeeds: string[]
): { title: string, description: string } => {
  // Find relevant content gap
  const relevantGap = contentGaps.find(gap => 
    gap.topic.toLowerCase().includes(focus.toLowerCase()) ||
    focus.toLowerCase().includes(gap.topic.toLowerCase())
  );

  // Find most effective writing style
  const effectiveStyle = writingStyles.find(style => style.impact.toLowerCase().includes('high'));

  // Find relevant audience need
  const relevantNeed = audienceNeeds.find(need =>
    need.toLowerCase().includes(focus.toLowerCase()) ||
    focus.toLowerCase().includes(need.toLowerCase())
  );

  const titleTemplates = {
    'blog-post': [
      `${relevantGap ? `[${relevantGap.opportunity}] ` : ''}The Strategic Guide to ${focus} for ${audience}`,
      `${effectiveStyle ? `[${effectiveStyle.style}] ` : ''}How ${audience} Can Transform Their ${focus} Strategy`,
      `${relevantNeed ? `[${relevantNeed}] ` : ''}Essential ${focus} Framework for ${audience}`,
    ],
    'social-media': [
      `📊 New Data: ${focus} Trends Reshaping ${audience}'s Strategy`,
      `💡 ${relevantGap ? relevantGap.opportunity : `Innovative ${focus} Approaches`} for ${audience}`,
      `🎯 ${relevantNeed ? `Solving ${relevantNeed}` : `Mastering ${focus}`} - Tips for ${audience}`,
    ],
    'newsletter': [
      `${focus} Intelligence: ${relevantGap ? relevantGap.opportunity : 'Strategic Insights'} for ${audience}`,
      `${focus} Insider: ${relevantNeed ? `Addressing ${relevantNeed}` : 'Key Developments'} for ${audience}`,
      `${focus} Strategy Brief: ${effectiveStyle ? `${effectiveStyle.style} Approaches` : 'Expert Analysis'} for ${audience}`,
    ],
    'video': [
      `[Video] ${relevantGap ? relevantGap.opportunity : focus} Masterclass for ${audience}`,
      `[Expert Analysis] ${focus} Strategy Deep-Dive: ${relevantNeed ? `Solving ${relevantNeed}` : 'Best Practices'}`,
      `[Strategy Session] ${effectiveStyle ? `${effectiveStyle.style} Approach to` : 'Mastering'} ${focus}`,
    ],
    'infographic': [
      `[Data Visualization] ${focus} Landscape for ${audience}: ${relevantGap ? relevantGap.opportunity : 'Strategic Overview'}`,
      `[Visual Guide] ${relevantNeed ? `Addressing ${relevantNeed} in` : 'Mapping'} ${focus} Strategy`,
      `[Framework] ${effectiveStyle ? `${effectiveStyle.style} Method for` : 'Strategic Approach to'} ${focus}`,
    ]
  };

  const descriptionTemplates = {
    'blog-post': [
      `In-depth analysis of ${focus} tailored for ${audience}, addressing ${relevantGap ? relevantGap.opportunity : 'key challenges'}. ${effectiveStyle ? `Written in a ${effectiveStyle.style} style` : ''} to maximize impact and actionability.`,
      `Strategic guide helping ${audience} master ${focus}, with emphasis on ${relevantNeed ? relevantNeed : 'core competencies'}. Includes practical frameworks and expert insights.`,
    ],
    'social-media': [
      `Quick, actionable insights on ${focus} for busy ${audience}. Focused on ${relevantGap ? relevantGap.opportunity : 'key opportunities'} with immediate application.`,
      `Engaging social content that breaks down ${focus} concepts for ${audience}, emphasizing ${relevantNeed ? relevantNeed : 'practical implementation'}.`,
    ],
    'newsletter': [
      `Curated ${focus} insights for ${audience}, highlighting ${relevantGap ? relevantGap.opportunity : 'emerging opportunities'}. ${effectiveStyle ? `Presented in a ${effectiveStyle.style} format` : ''} for maximum retention.`,
      `Strategic ${focus} updates tailored for ${audience}, focusing on ${relevantNeed ? relevantNeed : 'industry developments'} and actionable takeaways.`,
    ],
    'video': [
      `Visual deep-dive into ${focus} for ${audience}, exploring ${relevantGap ? relevantGap.opportunity : 'key strategies'}. ${effectiveStyle ? `Utilizing ${effectiveStyle.style} presentation style` : ''} for enhanced learning.`,
      `Expert-led video content breaking down ${focus} concepts for ${audience}, with emphasis on ${relevantNeed ? relevantNeed : 'practical application'}.`,
    ],
    'infographic': [
      `Data-driven visualization of ${focus} landscape for ${audience}, highlighting ${relevantGap ? relevantGap.opportunity : 'key metrics'} and strategic opportunities.`,
      `Visual framework mapping ${focus} strategy for ${audience}, emphasizing ${relevantNeed ? relevantNeed : 'critical success factors'} and implementation paths.`,
    ]
  };

  const typeTemplates = titleTemplates[type as keyof typeof titleTemplates] || titleTemplates['blog-post'];
  const typeDescTemplates = descriptionTemplates[type as keyof typeof descriptionTemplates] || descriptionTemplates['blog-post'];

  return {
    title: typeTemplates[Math.floor(Math.random() * typeTemplates.length)],
    description: typeDescTemplates[Math.floor(Math.random() * typeDescTemplates.length)]
  };
};

export default function CalendarPage() {
  const { user } = useAuth();
  const [view, setView] = useState<'month' | 'week'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [contentCalendar, setContentCalendar] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [contentPreferences, setContentPreferences] = useState<{ [key: string]: number }>({});

  const generateContentCalendar = useCallback((analysis: Analysis, preferences: { [key: string]: number } = contentPreferences) => {
    const calendar: CalendarItem[] = [];
    const startDate = new Date();
    startDate.setDate(1);
    
    const totalMonthlyContent = Object.values(preferences).reduce((sum, freq) => sum + freq, 0) || 28;
    
    const dates = Array.from({ length: totalMonthlyContent }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(Math.floor((i / totalMonthlyContent) * 28) + 1);
      return date;
    });

    const contentTypes = Object.entries(preferences).length > 0 ? preferences : {
      'blog-post': 4,
      'social-media': 16,
      'newsletter': 4,
      'video': 2,
      'infographic': 2
    };

    // Extract strategy data from analysis
    const strategy = analysis.overallStrategy || {};
    const contentGaps = strategy.contentGaps || [];
    const writingStyles = strategy.contentAudit?.writingStyles || [];
    const audienceNeeds = strategy.audienceAnalysis?.audienceNeeds || [];
    const topics = strategy.recommendations?.topicClusters || ['Content Strategy', 'Digital Marketing', 'Industry Trends'];
    const audiences = strategy.audienceAnalysis?.primaryAudiences || ['Marketing Professionals', 'Business Leaders'];

    let dateIndex = 0;
    for (const [type, frequency] of Object.entries(contentTypes)) {
      for (let i = 0; i < frequency; i++) {
        if (dateIndex < dates.length) {
          const focus = topics[i % topics.length];
          const audience = audiences[i % audiences.length];
          
          const contentIdea = generateContentIdea(
            type,
            focus,
            audience,
            contentGaps,
            writingStyles,
            audienceNeeds
          );
          
          const contentItem: CalendarItem = {
            id: `${type}-${i}`,
            ...contentIdea,
            contentType: type,
            date: dates[dateIndex],
            audience: audience,
            focus: focus,
            aiInsights: {
              audienceReason: `${audience} have shown high engagement with ${focus}-related content, particularly addressing ${audienceNeeds[i % audienceNeeds.length] || 'key industry challenges'}`,
              contentTypeReason: `${type} format is optimal for delivering ${focus} insights to ${audience}, aligned with their consumption preferences`,
              timingReason: `Publishing on ${dates[dateIndex].toLocaleDateString('en-US', { weekday: 'long' })}s shows higher engagement for ${audience} consuming ${type} content`,
              strategicValue: `This content addresses ${contentGaps[i % contentGaps.length]?.opportunity || `key opportunities in ${focus}`} while leveraging ${writingStyles[i % writingStyles.length]?.style || 'effective content delivery'} methods`
            }
          };
          calendar.push(contentItem);
          dateIndex++;
        }
      }
    }

    return calendar.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [contentPreferences]);

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
  }, [user, generateContentCalendar]);

  const handlePreferencesChange = (newPreferences: { [key: string]: number }) => {
    setContentPreferences(newPreferences);
    if (user) {
      // Update the content calendar based on new preferences
      const analysesQuery = query(
        collection(db, 'analyses'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      getDocs(analysesQuery).then((snapshot) => {
        if (!snapshot.empty) {
          const analysis = snapshot.docs[0].data() as Analysis;
          const calendar = generateContentCalendar(analysis, newPreferences);
          setContentCalendar(calendar);
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <ContentPreferences onPreferencesChange={handlePreferencesChange} />
      
      <div className="flex justify-between items-center mb-6">
        <div className="space-x-2">
          <button
            onClick={() => setView('month')}
            className={`px-4 py-2 rounded-lg ${
              view === 'month'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-4 py-2 rounded-lg ${
              view === 'week'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : view === 'month' ? (
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
    </div>
  );
} 