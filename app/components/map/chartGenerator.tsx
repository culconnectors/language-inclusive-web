'use client';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

interface ChartData {
  nationality?: string;
  language?: string;
  count: number;
}

interface ChartGeneratorProps {
  data: ChartData[];
  title: string;
}

const ChartGenerator = ({ data, title }: ChartGeneratorProps) => {
  const containerRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!containerRef.current || !data || data.length === 0) return;

    // Clear any existing chart and tooltips
    d3.select(containerRef.current).selectAll('svg').remove();
    d3.select(containerRef.current).selectAll('.tooltip').remove();

    // Get container dimensions
    // Set width to container width or max 800px
    const containerWidth = Math.min(containerRef.current.clientWidth || 800, 800);
    const aspectRatio = 4 / 3;
    const containerHeight = containerWidth / aspectRatio;

    // Define margins
    const margin = { top: 60, right: 90, bottom: 60, left: 150 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    // Create tooltip div
    const tooltip = d3.select(containerRef.current)
      .append('div')
      .attr('class', 'tooltip')
      .style('position', 'absolute')
      .style('background', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('box-shadow', '0 2px 4px rgba(0,0,0,0.1)')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 10);

    // Sort data
    const sortedData = [...data]
      .sort((a, b) => {
        const countDiff = b.count - a.count;
        if (countDiff !== 0) return countDiff;
        const aLabel = (a.nationality || a.language || '').toString();
        const bLabel = (b.nationality || b.language || '').toString();
        return aLabel.localeCompare(bLabel);
      })
      .slice(0, 10);

        // Create SVG with scaled size
    const svg = d3.select(containerRef.current)
    .append('svg')
    .attr('width', containerWidth)
    .attr('height', containerHeight)
    .attr('viewBox', `0 0 ${containerWidth} ${containerHeight}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d.count) || 0])
      .nice()
      .range([0, width]);

    const y = d3.scaleBand()
      .domain(sortedData.map(d => d.nationality || d.language || 'Unknown'))
      .range([0, height])
      .padding(0.1);

    // Use a categorical color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Add bars with transitions and interactivity
    const bars = g.selectAll('rect')
      .data(sortedData)
      .enter()
      .append('rect')
      .attr('y', d => y(d.nationality || d.language || 'Unknown') || 0)
      .attr('height', y.bandwidth())
      .attr('fill', d => color(d.nationality || d.language || 'Unknown'))
      .attr('rx', 4)
      .attr('ry', 4)
      .attr('width', 0)
      .style('opacity', 1);

    // Add bar transitions
    bars.transition()
      .duration(750)
      .delay((_, i) => i * 50)
      .attr('width', d => x(d.count));

    // Add hover effects
    bars.on('mouseover', function(event, d) {
      bars.style('opacity', 0.2);
      d3.select(this).style('opacity', 1);
      
      const containerBounds = containerRef.current!.getBoundingClientRect();
      const barBounds = (this as SVGRectElement).getBoundingClientRect();
      
      tooltip.html(`
        <div class="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16">
            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" fill="currentColor"/>
          </svg>
          <strong>Population</strong>
        </div>
        ${d.count.toLocaleString()}
      `)
        .style('left', `${barBounds.right - containerBounds.left + 8}px`)
        .style('top', `${barBounds.top - containerBounds.top + barBounds.height / 2 - 12}px`)
        .style('opacity', 1);
    })
    .on('mouseout', function() {
      bars.style('opacity', 1);
      tooltip.style('opacity', 0);
    });

    // Add value labels with transitions
    const labels = g.selectAll('.value-label')
      .data(sortedData)
      .enter()
      .append('text')
      .attr('class', 'value-label')
      .attr('x', d => x(d.count) + 5)
      .attr('y', d => (y(d.nationality || d.language || 'Unknown') || 0) + y.bandwidth() / 2)
      .attr('dy', '0.35em')
      .text(d => d.count.toLocaleString())
      .style('opacity', 0);

    // Animate labels
    labels.transition()
      .duration(750)
      .delay((_, i) => i * 50)
      .style('opacity', 1);

    // Add y-axis
    g.append('g')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', '12px')
      .style('font-family', 'sans-serif');

    // Add x-axis with grid lines
    const xAxis = g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x)
        .ticks(5)
        .tickFormat(d => d3.format(',')(d as number))
      );

    xAxis.selectAll('text')
      .style('font-size', '12px')
      .style('font-family', 'sans-serif');

    // Add grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(y)
        .tickSize(-width)
        .tickFormat(() => '')
      )
      .style('stroke-opacity', 0.1);

  }, [data, title]);

  return (
    <div className="w-full max-w-[800px] mx-auto p-4">
      <h2 className="text-xl font-bold text-center mb-4">{title}</h2>
  
      <div className="relative w-full aspect-[4/3]">
        <svg ref={containerRef} className="absolute top-0 left-0 w-full h-full" />
      </div>
  
      <div className="mt-4 text-sm text-center text-gray-500">
        Data Source:&nbsp;
        <a
          href="https://www.abs.gov.au/census/find-census-data/datapacks"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          ABS Census DataPacks
        </a>
      </div>
    </div>
  );
};

export default ChartGenerator;
