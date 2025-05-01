'use client';

import Map, { Layer, Source, Popup, MapRef } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useCallback, useEffect, useRef } from 'react';
import * as turf from '@turf/turf';
import { StatisticsMap } from './statisticsMap';
import ChartGenerator from './chartGenerator';
import LgaSidebar from './LgaSidebar';
import EnglishProficiencyChart from './englishProficiencyChart';
import { bbox, center } from '@turf/turf';
import CouncilInfoCard from './CouncilInfoCard';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface HoverInfo {
  lgaCode: string;
  lgaName: string;
  x: number;
  y: number;
}

interface StatisticData {
  lga_code: string;
  value: number;
}

interface ChartData {
  nationality?: string;
  language?: string;
  count: number;
}

interface LgaMapProps {
  onLgaSelect?: (lgaCode: string) => void;
}

const LgaMap = ({ onLgaSelect }: LgaMapProps = {}) => {
  const mapRef = useRef<MapRef>(null);
  const [hoveredLgaInfo, setHoveredLgaInfo] = useState<HoverInfo | null>(null);
  const [mode, setMode] = useState<'statistics' | 'nationalities' | 'language'>('statistics');
  const [selectedStatistic, setSelectedStatistic] = useState('');
  const [statisticData, setStatisticData] = useState<StatisticData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedLgaCode, setSelectedLgaCode] = useState<string | null>(null);
  const [selectedLgaName, setSelectedLgaName] = useState<string>('');
  const [showCouncilInfo, setShowCouncilInfo] = useState(false);

  // Fetch statistic data when statistic changes
  useEffect(() => {
    const fetchStatisticData = async () => {
      try {
        const response = await fetch(`/api/lga/statisticData?stat=${selectedStatistic}`);
        const data = await response.json();
        setStatisticData(data);
      } catch (error) {
        console.error('Failed to fetch statistic data:', error);
      }
    };

    if (mode === 'statistics' && selectedStatistic) {
      fetchStatisticData();
    }
  }, [selectedStatistic, mode]);

  // Fetch chart data when LGA is selected and mode is nationalities/language
  useEffect(() => {
    const fetchChartData = async () => {
      if (!selectedLgaCode || mode === 'statistics') {
        console.debug('Skipping chart data fetch:', { selectedLgaCode, mode });
        return;
      }
      
      try {
        console.debug('Fetching chart data:', { selectedLgaCode, mode });
        let endpoint;
        switch (mode) {
          case 'nationalities':
            endpoint = 'nationalitiesData';
            break;
          case 'language':
            endpoint = 'languagesData';
            break;
          default:
            console.warn('Unknown mode:', mode);
            return;
        }
        
        const response = await fetch(`/api/lga/${endpoint}?lgaCode=${selectedLgaCode}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.debug('Chart data received:', { dataLength: data.length, firstItem: data[0] });
        setChartData(data);
      } catch (error) {
        console.error(`Failed to fetch ${mode} data:`, error);
        setChartData([]);
      }
    };

    fetchChartData();
  }, [selectedLgaCode, mode]);

  // Add debug logging for render conditions
  useEffect(() => {
    console.debug('Chart render conditions:', {
      hasSelectedLgaCode: !!selectedLgaCode,
      mode,
      chartDataLength: chartData.length,
      selectedLgaName,
      shouldShowChart: selectedLgaCode && mode !== 'statistics' && chartData.length > 0
    });
  }, [selectedLgaCode, mode, chartData, selectedLgaName]);

  const handleMapLoad = useCallback((event: mapboxgl.MapboxEvent) => {
    const map = event.target;

    map.on('mousemove', 'vic-lga-cleaned-5yz92t', (e) => {
      if (e.features?.length && e.point) {
        const feature = e.features[0];
        const lgaCode = feature.properties?.lga_code || feature.properties?.LGA_CODE;
        const lgaName = feature.properties?.lga_name || feature.properties?.LGA_NAME;

        if (lgaCode && lgaName) {
          setHoveredLgaInfo({
            lgaCode,
            lgaName,
            x: e.point.x,
            y: e.point.y
          });
          map.getCanvas().style.cursor = 'pointer';
        }
      }
    });

    map.on('mouseleave', 'vic-lga-cleaned-5yz92t', () => {
      map.getCanvas().style.cursor = '';
      setHoveredLgaInfo(null);
    });

    map.on('click', 'vic-lga-cleaned-5yz92t', (e) => {
      if (e.features?.length) {
        const feature = e.features[0];
        const lgaCode = feature.properties?.lga_code || feature.properties?.LGA_CODE;
        const lgaName = feature.properties?.lga_name || feature.properties?.LGA_NAME;

        if (lgaCode && lgaName) {
          console.debug('LGA selected:', { lgaCode, lgaName });
          setSelectedLgaCode(lgaCode);
          setSelectedLgaName(lgaName);
          setShowCouncilInfo(true);
          onLgaSelect?.(lgaCode);

          // Calculate the bounding box and center of the feature
          if (feature.geometry) {
            try {
              const geoFeature = turf.feature(feature.geometry);
              const bounds = turf.bbox(geoFeature);
              const centerPoint = turf.center(geoFeature);
    
              if (mapRef.current) {
                mapRef.current.resize(); // ensure it adapts to current grid size
                mapRef.current.fitBounds(
                  [
                    [bounds[0], bounds[1]],
                    [bounds[2], bounds[3]]
                  ],
                  {
                    padding: 80,
                    duration: 1200,
                    essential: true
                  }
                );
              }
              
            } catch (error) {
              console.error('Error computing bounds or center:', error);
            }
          } else {
            console.warn('Missing geometry in clicked feature:', feature);
          }
        }
      }
    });
  }, [onLgaSelect]);

  return (
    <div className="flex flex-col gap-4">
      <LgaSidebar
        onModeChange={(newMode) => {
          console.debug('Mode changed:', { newMode, currentMode: mode });
          setMode(newMode);
          setSelectedLgaCode(null);
          setSelectedLgaName('');
          setShowCouncilInfo(false);
        }}
        onStatisticSelect={setSelectedStatistic}
      />

      <div className={`w-full ${selectedLgaCode && mode !== 'statistics' && chartData.length > 0 ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-4'}`}>
        <div className={`${selectedLgaCode && mode !== 'statistics' && chartData.length > 0 ? 'h-[600px]' : 'w-full h-[600px]'} rounded-lg overflow-hidden shadow-lg relative`}>
          <Map
            ref={mapRef}
            initialViewState={{ latitude: -37.5, longitude: 144.5, zoom: 6 }}
            mapStyle="mapbox://styles/mlee-0159/cm9tzg62f00fu01sp105a9d5v"
            mapboxAccessToken={MAPBOX_TOKEN}
            style={{ width: '100%', height: '100%' }}
            interactiveLayerIds={['vic-lga-cleaned-5yz92t']}
            onLoad={handleMapLoad}
          >
            {mode === 'statistics' && selectedStatistic && (
              <StatisticsMap statKey={selectedStatistic} />
            )}

            {/* Selected LGA highlight layer */}
            {selectedLgaCode && (
              <Layer
                id="selected-lga"
                type="fill"
                source="composite"
                source-layer="vic_lga_cleaned-5yz92t"
                paint={{
                  'fill-color': '#4A90E2',
                  'fill-outline-color': '#2171C7',
                  'fill-opacity': 0.6
                }}
                filter={['==', ['get', 'lga_code'], selectedLgaCode]}
              />
            )}

            {hoveredLgaInfo && (
              <>
                <Layer
                  id="hover-highlight"
                  type="fill"
                  source="composite"
                  source-layer="vic_lga_cleaned-5yz92t"
                  paint={{
                    'fill-color': '#afb1de',
                    'fill-outline-color': '#06072b',
                    'fill-opacity': 0.4
                  }}
                  filter={['==', ['get', 'lga_code'], hoveredLgaInfo.lgaCode]}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: hoveredLgaInfo.x,
                    top: hoveredLgaInfo.y,
                    transform: 'translate(-50%, -100%)',
                    backgroundColor: 'white',
                    padding: '8px',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    pointerEvents: 'none',
                    zIndex: 1
                  }}
                >
                  <span className="font-medium">{hoveredLgaInfo.lgaName}</span>
                  {mode === 'statistics' && selectedStatistic && statisticData.length > 0 && (
                    <div className="text-sm text-gray-600">
                      {statisticData.find(d => d.lga_code === hoveredLgaInfo.lgaCode)?.value.toLocaleString()}
                    </div>
                  )}
                </div>
              </>
            )}
          </Map>
        </div>

        {/* Chart Section */}
        {selectedLgaCode && mode !== 'statistics' && (
          <div className="bg-white p-4 rounded-lg shadow-lg">
            {mode === 'language' ? (
              <EnglishProficiencyChart 
                lgaCode={selectedLgaCode} 
                lgaName={selectedLgaName} 
              />
            ) : (
              <ChartGenerator
                data={chartData}
                title={`${mode === 'nationalities' ? 'Nationalities' : 'Languages'} in ${selectedLgaName}`}
              />
            )}
          </div>
        )}
      </div>

      {/* Council Info Card */}
      <CouncilInfoCard
        lgaCode={showCouncilInfo ? selectedLgaCode : null}
        onClose={() => setShowCouncilInfo(false)}
      />
    </div>
  );
};

export default LgaMap;
