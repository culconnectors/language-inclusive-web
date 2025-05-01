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

interface CouncilInfoCardProps {
  lgaCode: string | null;
  onClose: () => void;
}

export default function CouncilInfoCard({ lgaCode, onClose }: CouncilInfoCardProps) {
  const [councilInfo, setCouncilInfo] = useState<CouncilInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (lgaCode) {
      setIsVisible(true);
      fetch(`/api/lga/councilInfo/${lgaCode}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Council info not available');
          }
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
    } else {
      setIsVisible(false);
    }
  }, [lgaCode]);

  if (!lgaCode || !isVisible) return null;

  return (
    <div 
      className={`fixed top-0 left-0 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-x-0' : '-translate-x-full'
      }`}
      style={{ 
        width: '400px', 
        maxWidth: '90vw',
        zIndex: 1000,
        borderTopRightRadius: '0.75rem',
        borderBottomRightRadius: '0.75rem'
      }}
    >
      <div className="p-6 overflow-y-auto h-full">
        {/* Close button */}
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for animation to complete
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
          <div className="space-y-6 mt-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{councilInfo.council_name}</h2>
              <p className="mt-3 text-gray-600 leading-relaxed">{councilInfo.council_info}</p>
            </div>

            <div className="grid gap-4">
              {/* Address */}
              <div className="flex items-start gap-3">
                <div className="text-red-500 mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-gray-700">
                  {councilInfo.address}, {councilInfo.suburb} {councilInfo.postcode}
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="text-blue-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <a href={`tel:${councilInfo.phone}`} className="text-blue-600 hover:underline">
                  {councilInfo.phone}
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="text-green-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <a href={`mailto:${councilInfo.email}`} className="text-blue-600 hover:underline">
                  {councilInfo.email}
                </a>
              </div>

              {/* Website */}
              <div className="flex items-center gap-3">
                <div className="text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <a href={`https://${councilInfo.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Website
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>
    </div>
  );
} 