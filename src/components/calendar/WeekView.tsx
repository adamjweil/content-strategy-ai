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
      'Blog Post': 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
      'Social Media': 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
      'Newsletter': 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
      'Video': 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
      'Podcast': 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
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
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl transform transition-all">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 