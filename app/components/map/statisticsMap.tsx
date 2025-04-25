'use client';

import { useEffect, useState } from 'react';
import { Layer } from 'react-map-gl';
import * as d3 from 'd3';
import { interpolateYlOrRd } from 'd3-scale-chromatic';
import { ExpressionSpecification } from 'mapbox-gl';

interface StatisticFeature {
  lga_code: string;
  value: number;
}

interface Props {
  statKey: string;
}

export const StatisticsMap = ({ statKey }: Props) => {
  const [statData, setStatData] = useState<StatisticFeature[]>([]);
  const [colorExpression, setColorExpression] = useState<ExpressionSpecification | null>(null);
  const [legendData, setLegendData] = useState<{ color: string; range: string }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/lga/statisticData?stat=${statKey}`);
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data: StatisticFeature[] = await res.json();
        setStatData(data);
        // console.log('Fetched LGA codes:', data.map(d => d.lga_code));

        const values = data.map(d => d.value).filter(Number.isFinite);
        const min = Math.min(...values);
        const max = Math.max(...values);

        // Create a 6-color segmented scale
        const numBuckets = 6;
        const colorScale = d3.scaleQuantize<string>()
          .domain([min, max])
          .range(d3.quantize(interpolateYlOrRd, numBuckets));

        // Build a match expression for Mapbox GL
        const matchExpression: ExpressionSpecification = [
          'match',
          ['to-string', ['get', 'lga_code']],
          ...data.flatMap(({ lga_code, value }) => [String(lga_code), colorScale(value)]),
          '#eeeeee' 
          
        ];

        // Generate legend data
        const thresholds = colorScale.thresholds();
        const legendItems = d3.pairs([min, ...thresholds, max]).map(([start, end], i) => ({
          color: colorScale(start),
          range: `${Math.round(start)}-${Math.round(end)}`
        }));
        
        setLegendData(legendItems);
        setColorExpression(matchExpression);
        
      } catch (err) {
        console.error('Failed to load LGA statistics:', err);
      }
    };

    fetchData();
  }, [statKey]);

  if (!colorExpression) return null;

  return (
    <>
      <Layer
        id="statistics-fill"
        source="composite"
        source-layer="vic_lga_cleaned-5yz92t"
        type="fill"
        paint={{
          'fill-color': colorExpression,
          'fill-outline-color': '#999',
          'fill-opacity': 0.6
        }}
      />
      <div className="absolute bottom-8 right-8 bg-white p-4 rounded-lg shadow-lg">
        <h3 className="text-sm font-semibold mb-2">{statKey.replace(/_/g, ' ').toUpperCase()}</h3>
        <div className="space-y-2">
          {legendData.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <div 
                className="w-4 h-4" 
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs">{item.range}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default StatisticsMap;
