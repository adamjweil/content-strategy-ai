import { useState, useEffect } from 'react';
import { ContentItem } from '@/types';

interface MonthViewProps {
  contentCalendar: ContentItem[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export function MonthView({ contentCalendar, currentDate, onDateChange }: MonthViewProps) {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [localContentCalendar, setLocalContentCalendar] = useState(contentCalendar);

  useEffect(() => {
    setLocalContentCalendar(contentCalendar);
  }, [contentCalendar]);

  // Title templates for content generation
  const titleTemplates = [
    (topic: string, audience: string) => `The Ultimate Guide to ${topic} for ${audience}`,
    (topic: string, audience: string) => `How ${audience} Can Master ${topic}`,
    (topic: string, audience: string) => `${topic}: Essential Strategies and Insights`,
    (topic: string, audience: string) => `${topic} Strategies That Work for ${audience}`,
    (topic: string, audience: string) => `Why ${audience} Should Care About ${topic}`,
    (topic: string, audience: string) => `Mastering ${topic}: A Complete Guide`,
    (topic: string, audience: string) => `${topic} Best Practices for ${audience}`,
    (topic: string, audience: string) => `Transforming Your Approach to ${topic}`,
    (topic: string, audience: string) => `${topic}: A Fresh Perspective for ${audience}`,
    (topic: string, audience: string) => `Innovative ${topic} Strategies for ${audience}`,
  ];

  // Description templates for content generation
  const descriptionTemplates = [
    (topic: string, need: string, focus: string) => 
      `A comprehensive ${focus} that addresses ${need} by exploring ${topic}. This content piece will provide valuable insights and actionable strategies for our audience.`,
    (topic: string, need: string, focus: string) =>
      `Deep dive into ${topic} with this ${focus}, specifically designed to address ${need}. Packed with practical examples and expert insights.`,
    (topic: string, need: string, focus: string) =>
      `Explore innovative approaches to ${topic} in this ${focus}, tailored to solve ${need}. Includes real-world applications and success stories.`,
    (topic: string, need: string, focus: string) =>
      `A strategic look at ${topic}, focusing on how to effectively address ${need}. This ${focus} provides concrete steps and implementation guidelines.`,
    (topic: string, need: string, focus: string) =>
      `Transform your understanding of ${topic} with this insightful ${focus}. Learn proven methods to tackle ${need} with confidence.`,
  ];

  const regenerateContent = () => {
    if (!selectedContent) return;

    // Find the original content in the calendar
    const originalContent = localContentCalendar.find(item => item.id === selectedContent.id);
    if (!originalContent) return;

    // Get random templates
    const titleTemplate = titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
    const descriptionTemplate = descriptionTemplates[Math.floor(Math.random() * descriptionTemplates.length)];

    // Generate new content while keeping the same structure
    const newContent = {
      ...originalContent,
      title: titleTemplate(originalContent.focus, originalContent.audience),
      description: descriptionTemplate(originalContent.focus, originalContent.audience, originalContent.contentType),
    };

    // Update both the selected content and the calendar
    setSelectedContent(newContent);
    setLocalContentCalendar(prevCalendar =>
      prevCalendar.map(item =>
        item.id === originalContent.id ? newContent : item
      )
    );
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDayOfMonth = getFirstDayOfMonth(currentDate);
  const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const weeks = [];
  let days = [];
  let day = 1;

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(
      <td key={`empty-${i}`} className="relative w-[14.28%] pt-[14.28%] bg-gray-50 border border-gray-200">
        <div className="absolute inset-0 p-2"></div>
      </td>
    );
  }

  // Add cells for each day of the month
  while (day <= daysInMonth) {
    const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dayContent = localContentCalendar.filter(
      item => item.date.toDateString() === currentDay.toDateString()
    );
    const isToday = new Date().toDateString() === currentDay.toDateString();

    days.push(
      <td key={day} className="relative w-[14.28%] pt-[14.28%] border border-gray-200">
        <div className="absolute inset-0 p-2">
          <div className={`
            inline-block rounded-full w-8 h-8 mb-1 flex items-center justify-center
            ${isToday ? 'bg-blue-500 text-white' : 'text-gray-700'}
          `}>
            {day}
          </div>
          <div className="space-y-1 overflow-y-auto max-h-24">
            {dayContent.map((content) => (
              <button
                key={content.id}
                onClick={() => setSelectedContent(content)}
                className="w-full text-left p-1.5 text-xs bg-blue-50 border border-blue-100 rounded hover:bg-blue-100 transition-colors"
                title={content.title}
              >
                <div className="font-medium truncate">{content.title}</div>
                <div className="text-xs text-gray-500 truncate">{content.contentType}</div>
              </button>
            ))}
          </div>
        </div>
      </td>
    );

    if (days.length === 7) {
      weeks.push(<tr key={day} className="h-32">{days}</tr>);
      days = [];
    }

    day++;
  }

  // Add remaining days to complete the last week
  if (days.length > 0) {
    while (days.length < 7) {
      days.push(
        <td key={`empty-end-${days.length}`} className="relative w-[14.28%] pt-[14.28%] bg-gray-50 border border-gray-200">
          <div className="absolute inset-0 p-2"></div>
        </td>
      );
    }
    weeks.push(<tr key={day} className="h-32">{days}</tr>);
  }

  return (
    <div className="space-y-6 bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900">{monthYear}</h2>
        <div className="space-x-2">
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() - 1);
              onDateChange(newDate);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Previous
          </button>
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setMonth(newDate.getMonth() + 1);
              onDateChange(newDate);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Next
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full table-fixed">
          <thead>
            <tr>
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <th key={day} className="p-2 text-sm font-semibold text-gray-900 border-b border-gray-200 bg-gray-50">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{weeks}</tbody>
        </table>
      </div>

      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full shadow-2xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{selectedContent.title}</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={regenerateContent}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                  title="Regenerate content"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <div className="font-medium text-gray-900 mb-1">Description</div>
                <p className="text-gray-600">{selectedContent.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="font-medium text-gray-900 mb-1">Content Type</div>
                  <p className="text-gray-600">{selectedContent.contentType}</p>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">Target Audience</div>
                  <p className="text-gray-600">{selectedContent.audience}</p>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">Focus</div>
                  <p className="text-gray-600">{selectedContent.focus}</p>
                </div>
                <div>
                  <div className="font-medium text-gray-900 mb-1">Date</div>
                  <p className="text-gray-600">
                    {selectedContent.date.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 