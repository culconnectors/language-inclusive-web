// components/LgaSidebar.tsx
import { useState } from 'react';

interface LgaSidebarProps {
  onModeChange: (mode: 'statistics' | 'nationalities' | 'language') => void;
  onStatisticSelect: (stat: string) => void;
}

const LgaSidebar = ({ onModeChange, onStatisticSelect }: LgaSidebarProps) => {
  const [activeMode, setActiveMode] = useState<'statistics' | 'nationalities' | 'language'>('statistics');
  const [selectedStat, setSelectedStat] = useState('');

  const handleModeChange = (mode: 'statistics' | 'nationalities' | 'language') => {
    setActiveMode(mode);
    onModeChange(mode);
  };

  const handleStatisticChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stat = e.target.value;
    setSelectedStat(stat);
    onStatisticSelect(stat);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex gap-4 items-center">
        <button
          onClick={() => handleModeChange('statistics')}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            activeMode === 'statistics'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Statistics
        </button>
        {activeMode === 'statistics' && (
          <select
            onChange={handleStatisticChange}
            value={selectedStat}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="" disabled>Choose a statistic</option>
            <option value="born_overseas">Born Overseas</option>
            <option value="pct_proficient_english">English Proficiency</option>
            <option value="pct_arrived_within_5_years">Recent Arrivals</option>
            <option value="percent_speaks_other_lang_at_home">Other Language at Home</option>
            <option value="pct_completed_year_12">Completed Year 12</option>
            <option value="pct_bachelor_degree">Bachelor Degree</option>
            <option value="pct_postgraduate">Postgraduate</option>
          </select>
        )}
        <button
          onClick={() => handleModeChange('nationalities')}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            activeMode === 'nationalities'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Nationalities
        </button>
        <button
          onClick={() => handleModeChange('language')}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            activeMode === 'language'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Languages
        </button>
      </div>
    </div>
  );
};

export default LgaSidebar;
