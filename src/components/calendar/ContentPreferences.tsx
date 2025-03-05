import { useState } from 'react';

interface ContentType {
  id: string;
  name: string;
  description: string;
  defaultFrequency: number;
}

const contentTypes: ContentType[] = [
  {
    id: 'blog-post',
    name: 'Blog Posts',
    description: 'In-depth articles that establish thought leadership and drive organic traffic',
    defaultFrequency: 4
  },
  {
    id: 'social-media',
    name: 'Social Media Posts',
    description: 'Engaging updates to maintain audience connection and share quick insights',
    defaultFrequency: 16
  },
  {
    id: 'newsletter',
    name: 'Email Newsletters',
    description: 'Curated content to nurture subscriber relationships',
    defaultFrequency: 4
  },
  {
    id: 'video',
    name: 'Video Content',
    description: 'Visual content for higher engagement and complex topic explanation',
    defaultFrequency: 2
  },
  {
    id: 'infographic',
    name: 'Infographics',
    description: 'Visual data representation for better information retention',
    defaultFrequency: 2
  }
];

interface ContentPreferencesProps {
  onPreferencesChange: (preferences: { [key: string]: number }) => void;
}

export function ContentPreferences({ onPreferencesChange }: ContentPreferencesProps) {
  const [frequencies, setFrequencies] = useState<{ [key: string]: number }>(() => {
    const initial: { [key: string]: number } = {};
    contentTypes.forEach(type => {
      initial[type.id] = type.defaultFrequency;
    });
    return initial;
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const handleFrequencyChange = (typeId: string, value: number) => {
    const newFrequencies = {
      ...frequencies,
      [typeId]: value
    };
    setFrequencies(newFrequencies);
    onPreferencesChange(newFrequencies);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Content Preferences</h2>
          <p className="text-sm text-gray-600">Customize your monthly content mix</p>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
        >
          {isExpanded ? (
            <>
              <span>Show Less</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              <span>Customize</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      </div>

      <div className={`space-y-6 transition-all duration-300 ease-in-out ${isExpanded ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        {contentTypes.map(type => (
          <div key={type.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium text-gray-800">{type.name}</h3>
                <p className="text-sm text-gray-600">{type.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleFrequencyChange(type.id, Math.max(0, frequencies[type.id] - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="w-12 text-center font-medium text-gray-800">{frequencies[type.id]}/mo</span>
                <button
                  onClick={() => handleFrequencyChange(type.id, frequencies[type.id] + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    {frequencies[type.id] === 0 ? 'None' : frequencies[type.id] <= 2 ? 'Low' : frequencies[type.id] <= 8 ? 'Moderate' : 'High'}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div
                  style={{ width: `${Math.min((frequencies[type.id] / 20) * 100, 100)}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-300"
                />
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Total monthly content pieces: </span>
            {Object.values(frequencies).reduce((a, b) => a + b, 0)}
          </div>
          <button
            onClick={() => {
              const defaultFrequencies: { [key: string]: number } = {};
              contentTypes.forEach(type => {
                defaultFrequencies[type.id] = type.defaultFrequency;
              });
              setFrequencies(defaultFrequencies);
              onPreferencesChange(defaultFrequencies);
            }}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
} 