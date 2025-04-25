'use client';

import Map, { Layer, Source, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useCallback, useEffect } from 'react';
import { StatisticsMap } from './statisticsMap';
import ChartGenerator from './chartGenerator';
import LgaSidebar from './LgaSidebar';

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
  const [hoveredLgaInfo, setHoveredLgaInfo] = useState<HoverInfo | null>(null);
  const [mode, setMode] = useState<'statistics' | 'nationalities' | 'language'>('statistics');
  const [selectedStatistic, setSelectedStatistic] = useState('');
  const [statisticData, setStatisticData] = useState<StatisticData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [selectedLgaCode, setSelectedLgaCode] = useState<string | null>(null);

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
      if (!selectedLgaCode || mode === 'statistics') return;
      
      try {
        const endpoint = mode === 'nationalities' ? 'nationalitiesData' : 'languagesData';
        const response = await fetch(`/api/lga/${endpoint}?lgaCode=${selectedLgaCode}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error(`Failed to fetch ${mode} data:`, error);
        setChartData([]);
      }
    };

    fetchChartData();
  }, [selectedLgaCode, mode]);

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

        if (lgaCode) {
          setSelectedLgaCode(lgaCode);
          onLgaSelect?.(lgaCode);
        }
      }
    });
  }, [onLgaSelect]);

  return (
    <div className="flex flex-col gap-4">
      <LgaSidebar 
        onModeChange={setMode}
        onStatisticSelect={setSelectedStatistic}
      />
      
      <div className="flex flex-col gap-4">
        <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg relative">
          <Map
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

        {selectedLgaCode && mode !== 'statistics' && chartData.length > 0 && (
          <div className="w-full bg-white rounded-lg shadow-lg p-4">
            <ChartGenerator 
              data={chartData}
              title={`${mode === 'nationalities' ? 'Nationalities' : 'Languages'} in ${hoveredLgaInfo?.lgaName || ''}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LgaMap;
