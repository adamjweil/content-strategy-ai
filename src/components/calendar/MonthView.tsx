import React, { Component } from 'react';
import { ContentItem } from '@/types';

interface MonthViewProps {
  contentCalendar: ContentItem[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

interface MonthViewState {
  selectedContent: ContentItem | null;
  localContentCalendar: ContentItem[];
}

export class MonthView extends Component<MonthViewProps, MonthViewState> {
  constructor(props: MonthViewProps) {
    super(props);
    this.state = {
      selectedContent: null,
      localContentCalendar: props.contentCalendar
    };
  }

  componentDidUpdate(prevProps: MonthViewProps) {
    if (prevProps.contentCalendar !== this.props.contentCalendar) {
      this.setState({ localContentCalendar: this.props.contentCalendar });
    }
  }

  getContentColor = (contentType: string) => {
    const colors: { [key: string]: string } = {
      'blog-post': 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
      'social-media': 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
      'newsletter': 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100',
      'video': 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100',
      'infographic': 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
    };
    return colors[contentType] || 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100';
  };

  // Title templates for content generation
  titleTemplates = [
    (topic: string) => `The Ultimate Guide to ${topic}`,
    (topic: string) => `How to Master ${topic}`,
    (topic: string) => `${topic}: Essential Strategies and Insights`,
    (topic: string) => `${topic} Strategies That Work`,
    (topic: string) => `Why You Should Care About ${topic}`,
    (topic: string) => `Mastering ${topic}: A Complete Guide`,
    (topic: string) => `${topic} Best Practices`,
    (topic: string) => `Transforming Your Approach to ${topic}`,
    (topic: string) => `${topic}: A Fresh Perspective`,
    (topic: string) => `Innovative ${topic} Strategies`,
  ];

  regenerateContent = () => {
    const { selectedContent, localContentCalendar } = this.state;
    if (!selectedContent) return;

    // Find the original content in the calendar
    const originalContent = localContentCalendar.find(item => item.id === selectedContent.id);
    if (!originalContent) return;

    // Get random templates
    const titleTemplate = this.titleTemplates[Math.floor(Math.random() * this.titleTemplates.length)];

    // Generate new content while keeping the same structure
    const newContent = {
      ...originalContent,
      title: titleTemplate(originalContent.focus),
    };

    // Update both the selected content and the calendar
    this.setState(prevState => ({
      selectedContent: newContent,
      localContentCalendar: prevState.localContentCalendar.map(item =>
        item.id === originalContent.id ? newContent : item
      )
    }));
  };

  getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  render() {
    const { currentDate, onDateChange } = this.props;
    const { selectedContent, localContentCalendar } = this.state;

    const daysInMonth = this.getDaysInMonth(currentDate);
    const firstDayOfMonth = this.getFirstDayOfMonth(currentDate);
    const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

    const weeks = [];
    let days = [];
    let day = 1;

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <td key={`empty-${i}`} className="border-b border-r border-gray-200 bg-gray-50/50">
          <div className="min-h-[8rem]"></div>
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
        <td key={day} className={`relative border-b border-r border-gray-200 transition-colors duration-200 group hover:bg-gray-50/50 ${
          isToday ? 'bg-blue-50/30' : ''
        }`}>
          <div className="min-h-[8rem] p-2">
            <div className="flex items-center justify-between mb-2">
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm
                ${isToday 
                  ? 'bg-blue-500 text-white ring-4 ring-blue-100' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}>
                {day}
              </div>
              {dayContent.length > 0 && (
                <span className="text-xs font-medium text-gray-500">
                  {dayContent.length} {dayContent.length === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
            <div className="space-y-1.5 overflow-y-auto max-h-[6rem]">
              {dayContent.map((content) => (
                <button
                  key={content.id}
                  onClick={() => this.setState({ selectedContent: content })}
                  className={`w-full text-left px-2.5 py-1.5 text-xs border rounded-lg transition-all duration-200 group/item ${this.getContentColor(content.contentType)}`}
                  title={content.title}
                >
                  <div className="font-medium truncate group-hover/item:text-opacity-100">{content.title}</div>
                  <div className="text-[10px] opacity-75">{content.contentType}</div>
                </button>
              ))}
            </div>
          </div>
        </td>
      );

      if (days.length === 7) {
        weeks.push(<tr key={day}>{days}</tr>);
        days = [];
      }

      day++;
    }

    // Add remaining days to complete the last week
    if (days.length > 0) {
      while (days.length < 7) {
        days.push(
          <td key={`empty-end-${days.length}`} className="border-b border-r border-gray-200 bg-gray-50/50">
            <div className="min-h-[8rem]"></div>
          </td>
        );
      }
      weeks.push(<tr key={day}>{days}</tr>);
    }

    return (
      <div className="space-y-6 bg-gradient-to-b from-white to-gray-50 rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <div className="space-y-1">
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight">{monthYear}</h2>
            <p className="text-gray-500">Plan and manage your content calendar</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex items-center p-1">
              <button
                onClick={() => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(newDate.getMonth() - 1);
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
                  newDate.setMonth(newDate.getMonth() + 1);
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

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="w-full table-fixed">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <th key={day} className="py-4 px-3 text-sm font-semibold text-gray-600">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {weeks}
            </tbody>
          </table>
        </div>

        {selectedContent && (
          <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl transform transition-all overflow-y-auto max-h-[90vh]">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1 flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">{selectedContent.title}</h3>
                  <p className="text-gray-500 text-sm">{selectedContent.date.toLocaleDateString('default', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={this.regenerateContent}
                    className="text-gray-500 hover:text-gray-700 transition-colors p-2.5 hover:bg-gray-100 rounded-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                  <button
                    onClick={() => this.setState({ selectedContent: null })}
                    className="text-gray-500 hover:text-gray-700 transition-colors p-2.5 hover:bg-gray-100 rounded-xl"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="space-y-8">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                  <div className="font-semibold text-gray-900 mb-3">Description</div>
                  <p className="text-gray-600 leading-relaxed">{selectedContent.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
                    <div className="font-semibold text-gray-900">Content Type</div>
                    <p className={`text-sm px-3 py-1.5 rounded-lg inline-block ${this.getContentColor(selectedContent.contentType)}`}>
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
} 