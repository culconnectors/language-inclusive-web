// components/LgaSidebar.tsx
import { useState } from 'react';

/**
 * Props for the LgaSidebar component.
 * @property onModeChange - Callback invoked when the mode changes (statistics, nationalities, language)
 * @property onStatisticSelect - Callback invoked when a statistic is selected
 * @property onToggleLandmarks - Callback invoked when the landmarks toggle is changed
 */
interface LgaSidebarProps {
  onModeChange: (mode: 'statistics' | 'nationalities' | 'language') => void;
  onStatisticSelect: (stat: string) => void
  showLandmarks: boolean;
  onToggleLandmarks: (show: boolean) => void;
}

/**
 * Sidebar component for controlling map display modes, statistics, and landmarks.
 *
 * - Allows switching between statistics, nationalities, and language modes
 * - Lets user select a statistic to display
 * - Provides a toggle for showing/hiding landmarks
 *
 * @param {LgaSidebarProps} props - Component props
 * @returns {JSX.Element}
 */
const LgaSidebar = ({ onModeChange, onStatisticSelect, showLandmarks, onToggleLandmarks }: LgaSidebarProps) => {
  /**
   * State for the currently active mode (statistics, nationalities, or language)
   */
  const [activeMode, setActiveMode] = useState<'statistics' | 'nationalities' | 'language'>('statistics');

  /**
   * State for the currently selected statistic (used in statistics mode)
   */
  const [selectedStat, setSelectedStat] = useState('');

  /**
   * Handles changing the active mode (statistics, nationalities, language)
   * Updates local state and notifies parent via onModeChange
   * @param mode - The new mode to activate
   */
  const handleModeChange = (mode: 'statistics' | 'nationalities' | 'language') => {
    setActiveMode(mode);
    onModeChange(mode);
  };

  /**
   * Handles changing the selected statistic in statistics mode
   * Updates local state and notifies parent via onStatisticSelect
   * @param e - The change event from the select input
   */
  const handleStatisticChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stat = e.target.value;
    setSelectedStat(stat);
    onStatisticSelect(stat);
  };

  /**
   * Toggles the display of landmarks on the map
   * Updates local state and notifies parent via onToggleLandmarks
   */
  const toggleLandmarks = () => {
    onToggleLandmarks(!showLandmarks);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="flex gap-4 items-center flex-wrap">
        {/* Mode selection buttons */}
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
        {/* Statistic selection dropdown (only in statistics mode) */}
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
          English Proficiency
        </button>
        {/* Landmarks toggle button */}
        <button
          onClick={toggleLandmarks}
          className={`px-4 py-2 rounded-md transition-colors duration-200 ${
            showLandmarks
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {showLandmarks ? 'Hide Landmarks' : 'Show Landmarks'}
        </button>
      </div>
    </div>
  );
};

export default LgaSidebar;
