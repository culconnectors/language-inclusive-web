'use client';
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

interface ChartData {
  nationality?: string;
  language?: string;
  count: number;
  percentage?: number;
}

interface ChartGeneratorProps {
  data: ChartData[];
  title: string;
}

const ChartGenerator = ({ data, title }: ChartGeneratorProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    // Sort and slice top 10 entries
    const chartData = [...data]
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)
      .map(d => ({
        ...d,
        label: d.nationality || d.language || 'Unknown'
      }));

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove();

    // Chart dimensions
    const margin = { top: 30, right: 120, bottom: 40, left: 200 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select(svgRef.current)
      .attr('width', '100%')
      .attr('height', height + margin.top + margin.bottom)
      .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const y = d3.scaleBand()
      .domain(chartData.map(d => d.label))
      .range([0, height])
      .padding(0.2);

    const x = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.count) || 0])
      .nice()
      .range([0, width]);

    // Create and style the bars
    svg.selectAll('rect')
      .data(chartData)
      .join('rect')
      .attr('y', d => y(d.label) || 0)
      .attr('height', y.bandwidth())
      .attr('x', 0)
      .attr('width', d => x(d.count))
      .attr('fill', '#6366f1')
      .attr('rx', 4)
      .transition()
      .duration(500)
      .attr('width', d => x(d.count));

    // Add value labels
    svg.selectAll('.value-label')
      .data(chartData)
      .join('text')
      .attr('class', 'value-label')
      .attr('y', d => (y(d.label) || 0) + y.bandwidth() / 2)
      .attr('x', d => x(d.count) + 5)
      .attr('dy', '0.35em')
      .text(d => {
        if (d.percentage !== undefined) {
          return `${d.count} (${d.percentage.toFixed(1)}%)`;
        }
        return d.count.toString();
      })
      .style('font-size', '12px')
      .style('fill', '#4b5563');

    // Add y-axis with labels
    svg.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('font-size', '12px')
      .call(wrap, margin.left - 10);

    // Add x-axis
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll('text')
      .style('font-size', '12px');

    // Add title
    svg.append('text')
      .attr('class', 'chart-title')
      .attr('x', width / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text(title);

  }, [data, title]);

  // Helper function to wrap long text
  function wrap(text: d3.Selection<d3.BaseType, unknown, SVGGElement, unknown>, width: number) {
    text.each(function() {
      const text = d3.select(this);
      const words = text.text().split(/\s+/);
      let line: string[] = [];
      let lineNumber = 0;
      const lineHeight = 1.1;
      const y = text.attr('y');
      const dy = parseFloat(text.attr('dy') || '0');
      let tspan = text.text(null).append('tspan')
        .attr('x', -10)
        .attr('y', y)
        .attr('dy', dy + 'em');

      words.forEach(word => {
        line.push(word);
        tspan.text(line.join(' '));
        if ((tspan.node()?.getComputedTextLength() || 0) > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text.append('tspan')
            .attr('x', -10)
            .attr('y', y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(word);
        }
      });
    });
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg ref={svgRef} className="w-full"></svg>
    </div>
  );
};

export default ChartGenerator;
