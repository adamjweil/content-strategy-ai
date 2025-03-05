import { useState } from 'react';
import { ContentItem } from '@/types';

interface WeekViewProps {
  contentCalendar: ContentItem[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export function WeekView({ contentCalendar, currentDate, onDateChange }: WeekViewProps) {
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);

  // Get the start of the week (Sunday)
  const getStartOfWeek = (date: Date) => {
    const result = new Date(date);
    const day = result.getDay();
    result.setDate(result.getDate() - day);
    return result;
  };

  // Get array of dates for the week
  const getWeekDates = (startDate: Date) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const startOfWeek = getStartOfWeek(currentDate);
  const weekDates = getWeekDates(startOfWeek);
  const weekRange = `${startOfWeek.toLocaleDateString()} - ${weekDates[6].toLocaleDateString()}`;

  const getContentColor = (contentType: string) => {
    const colors: { [key: string]: string } = {
      'blog-post': 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
      'social-media': 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
      'newsletter': 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100',
      'video': 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
      'infographic': 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
    };
    return colors[contentType] || 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100';
  };

  return (
    <div className="space-y-6 bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-lg p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <div className="space-y-1">
          <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Week View</h2>
          <p className="text-gray-500">{weekRange}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center p-1">
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() - 7);
                onDateChange(newDate);
              }}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => onDateChange(new Date())}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
            >
              Today
            </button>
            <button
              onClick={() => {
                const newDate = new Date(currentDate);
                newDate.setDate(newDate.getDate() + 7);
                onDateChange(newDate);
              }}
              className="p-2 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDates.map((date, index) => {
          const dayContent = contentCalendar.filter(
            item => item.date.toDateString() === date.toDateString()
          );
          const isToday = date.toDateString() === new Date().toDateString();

          return (
            <div 
              key={index} 
              className={`bg-white border rounded-2xl p-4 min-h-[16rem] flex flex-col transition-all duration-200 hover:shadow-md ${
                isToday ? 'ring-2 ring-blue-100 border-blue-200' : 'border-gray-200'
              }`}
            >
              <div className={`space-y-1 mb-4 ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                <div className="text-sm font-medium">
                  {date.toLocaleDateString('default', { weekday: 'short' })}
                </div>
                <div className="text-2xl font-bold">
                  {date.toLocaleDateString('default', { day: 'numeric' })}
                </div>
              </div>
              <div className="space-y-2 flex-1 overflow-y-auto">
                {dayContent.map((content) => (
                  <button
                    key={content.id}
                    onClick={() => setSelectedContent(content)}
                    className={`w-full text-left p-3 border rounded-xl transition-all duration-200 ${getContentColor(content.contentType)}`}
                  >
                    <div className="font-medium text-sm truncate mb-1">{content.title}</div>
                    <div className="text-xs opacity-75">{content.contentType}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedContent && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl transform transition-all overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1 flex-1">
                <h3 className="text-2xl font-bold text-gray-900 leading-tight">{selectedContent.title}</h3>
                <p className="text-gray-500 text-sm">
                  {selectedContent.date.toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <button
                onClick={() => setSelectedContent(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-2.5 hover:bg-gray-100 rounded-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <div className="font-semibold text-gray-900 mb-3">Description</div>
                <p className="text-gray-600 leading-relaxed">{selectedContent.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                  <div className="font-semibold text-gray-900">Content Type</div>
                  <p className={`text-sm px-3 py-1.5 rounded-lg inline-block ${getContentColor(selectedContent.contentType)}`}>
                    {selectedContent.contentType}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                  <div className="font-semibold text-gray-900">Target Audience</div>
                  <p className="text-sm bg-purple-50 border border-purple-200 text-purple-700 px-3 py-1.5 rounded-lg inline-block">
                    {selectedContent.audience}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                  <div className="font-semibold text-gray-900">Focus</div>
                  <p className="text-sm bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg inline-block">
                    {selectedContent.focus}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                  <div className="font-semibold text-gray-900">Status</div>
                  <p className="text-sm bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg inline-block">
                    Scheduled
                  </p>
                </div>
              </div>

              {/* AI Insights Section - Moved to bottom */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="font-semibold text-blue-800 text-lg">AI Content Strategy Insights</div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Why this audience?</h4>
                    <p className="text-blue-800 text-sm bg-blue-100/50 p-3 rounded-lg">{selectedContent.aiInsights.audienceReason}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Why this content type?</h4>
                    <p className="text-blue-800 text-sm bg-blue-100/50 p-3 rounded-lg">{selectedContent.aiInsights.contentTypeReason}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Why this timing?</h4>
                    <p className="text-blue-800 text-sm bg-blue-100/50 p-3 rounded-lg">{selectedContent.aiInsights.timingReason}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-1">Strategic value</h4>
                    <p className="text-blue-800 text-sm bg-blue-100/50 p-3 rounded-lg">{selectedContent.aiInsights.strategicValue}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 