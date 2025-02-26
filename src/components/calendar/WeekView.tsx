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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{weekRange}</h2>
        <div className="space-x-2">
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(newDate.getDate() - 7);
              onDateChange(newDate);
            }}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Previous Week
          </button>
          <button
            onClick={() => {
              const newDate = new Date(currentDate);
              newDate.setDate(newDate.getDate() + 7);
              onDateChange(newDate);
            }}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            Next Week
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {weekDates.map((date, index) => {
          const dayContent = contentCalendar.filter(
            item => item.date.toDateString() === date.toDateString()
          );

          return (
            <div key={index} className="border rounded-lg p-4">
              <div className="font-semibold mb-2">
                {date.toLocaleDateString('default', { weekday: 'short' })}
                <br />
                {date.toLocaleDateString('default', { month: 'short', day: 'numeric' })}
              </div>
              <div className="space-y-2">
                {dayContent.map((content) => (
                  <button
                    key={content.id}
                    onClick={() => setSelectedContent(content)}
                    className="w-full text-left p-2 bg-blue-100 rounded hover:bg-blue-200"
                  >
                    <div className="font-medium truncate">{content.title}</div>
                    <div className="text-sm text-gray-600">{content.contentType}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{selectedContent.title}</h3>
              <button
                onClick={() => setSelectedContent(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <div className="font-medium">Description</div>
                <p className="text-gray-600">{selectedContent.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-medium">Content Type</div>
                  <p className="text-gray-600">{selectedContent.contentType}</p>
                </div>
                <div>
                  <div className="font-medium">Target Audience</div>
                  <p className="text-gray-600">{selectedContent.audience}</p>
                </div>
                <div>
                  <div className="font-medium">Focus</div>
                  <p className="text-gray-600">{selectedContent.focus}</p>
                </div>
                <div>
                  <div className="font-medium">Date</div>
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