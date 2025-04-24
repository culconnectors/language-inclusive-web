'use client';

import Map, { Layer, Source, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useState, useCallback } from 'react';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface HoverInfo {
  lgaCode: string;
  lgaName: string;
  x: number;
  y: number;
}

const LgaMap = ({ onSuburbSelect }: { onSuburbSelect: (lgaCode: string) => void }) => {
  const [hoveredLgaInfo, setHoveredLgaInfo] = useState<HoverInfo | null>(null);

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
          onSuburbSelect(lgaCode);
        }
      }
    });
  }, [onSuburbSelect]);

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg relative">
      <Map
        initialViewState={{ latitude: -37.5, longitude: 144.5, zoom: 7 }}
        mapStyle="mapbox://styles/mlee-0159/cm9tzg62f00fu01sp105a9d5v"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{ width: '100%', height: '100%' }}
        interactiveLayerIds={['vic-lga-cleaned-5yz92t']}
        onLoad={handleMapLoad}
      >
        {/* Hover Highlight Layer */}
        {hoveredLgaInfo && (
          <>
            <Layer
              id="hover-highlight"
              type="fill"
              source="composite"
              source-layer="vic_lga_cleaned-5yz92t"
              paint={{
                'fill-color': '#d99329',
                'fill-opacity': 0.4
              }}
              filter={['==', ['get', 'lga_code'], hoveredLgaInfo.lgaCode]}
            />
            {/* Hover Tooltip */}
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
            </div>
          </>
        )}
      </Map>
    </div>
  );
};

export default LgaMap;
