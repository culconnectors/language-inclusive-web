import { useEffect, useState } from 'react';

interface CouncilInfo {
  council_name: string;
  council_info: string;
  address: string;
  suburb: string;
  postcode: number;
  phone: string;
  email: string;
  website: string;
}

interface LGAStatistics {
  total_businesses: number;
  total_employed_over_15: number;
  born_overseas: number;
  pct_arrived_within_5_years: string;
  pct_proficient_english: string;
  pct_speaks_other_lang_at_home: string;
  median_age_years: string;
  pct_completed_year_12: string;
  pct_certificate: string;
  pct_bachelor_degree: string;
  pct_postgraduate: string;
  pct_managers: string;
  pct_professionals: string;
  pct_labourers: string;
}

interface CouncilInfoCardProps {
  lgaCode: string | null;
  onClose: () => void;
}

export default function CouncilInfoCard({ lgaCode, onClose }: CouncilInfoCardProps) {
  const [councilInfo, setCouncilInfo] = useState<CouncilInfo | null>(null);
  const [statistics, setStatistics] = useState<LGAStatistics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (lgaCode) {
      setIsVisible(true);

      fetch(`/api/lga/councilInfo/${lgaCode}`)
        .then(response => {
          if (!response.ok) throw new Error('Council info not available');
          return response.json();
        })
        .then(data => {
          setCouncilInfo(data);
          setError(null);
        })
        .catch(err => {
          console.error('Council info fetch failed:', err);
          setError('Council information not available');
          setCouncilInfo(null);
        });

      fetch(`/api/lga/statistics/${lgaCode}`)
        .then(response => {
          if (!response.ok) throw new Error('Statistics not available');
          return response.json();
        })
        .then(data => {
          setStatistics(data);
        })
        .catch(err => {
          console.error('Statistics fetch failed:', err);
          setStatistics(null);
        });
    } else {
      setIsVisible(false);
    }
  }, [lgaCode]);

  if (!lgaCode || !isVisible) return null;

  return (
    <div 
      className={`fixed top-0 left-0 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}
      style={{
        width: 'min(90vw, 480px)',
        zIndex: 1000,
        borderTopRightRadius: '1rem',
        borderBottomRightRadius: '1rem',
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {error ? (
            <div className="text-red-500 mt-8">{error}</div>
          ) : councilInfo ? (
            <>
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-800">{councilInfo.council_name}</h2>
                <p className="mt-3 text-gray-600 leading-relaxed">{councilInfo.council_info}</p>
              </div>

              <div className="grid gap-4">
                <div className="flex items-start gap-3">
                  <div className="text-red-500 mt-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-700">
                    {councilInfo.address}, {councilInfo.suburb} {councilInfo.postcode}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-blue-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <a href={`tel:${councilInfo.phone}`} className="text-blue-600 hover:underline">
                    {councilInfo.phone}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-green-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <a href={`mailto:${councilInfo.email}`} className="text-blue-600 hover:underline">
                    {councilInfo.email}
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <a href={`https://${councilInfo.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Website
                  </a>
                </div>
              </div>

              {/* Statistics Section */}
              {statistics && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Local Government Statistics</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <Stat label="Businesses" value={statistics.total_businesses} />
                    <Stat label="Employed (15+)" value={statistics.total_employed_over_15} />
                    <Stat label="Born overseas" value={statistics.born_overseas} />
                    <Stat label="Arrived ≤5 yrs" value={`${statistics.pct_arrived_within_5_years}%`} />
                    <Stat label="Proficient English" value={`${statistics.pct_proficient_english}%`} />
                    <Stat label="Other lang @home" value={`${statistics.pct_speaks_other_lang_at_home}%`} />
                    <Stat label="Median age" value={`${statistics.median_age_years} yrs`} />
                    <Stat label="Year-12 completed" value={`${statistics.pct_completed_year_12}%`} />
                    <Stat label="Certificate" value={`${statistics.pct_certificate}%`} />
                    <Stat label="Bachelor degree" value={`${statistics.pct_bachelor_degree}%`} />
                    <Stat label="Post-graduate" value={`${statistics.pct_postgraduate}%`} />
                    <Stat label="Managers" value={`${statistics.pct_managers}%`} />
                    <Stat label="Professionals" value={`${statistics.pct_professionals}%`} />
                    <Stat label="Labourers" value={`${statistics.pct_labourers}%`} />
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}
        </div>
        <div className="p-4 text-center text-xs text-gray-400 border-t">
          ABS Census Council Information
        </div>
      </div>
    </div>
  );
}

// Helper component for stats
function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between text-gray-700">
      <span className="font-medium">{label}</span>
      <span>{value}</span>
    </div>
  );
}
