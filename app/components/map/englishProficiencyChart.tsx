"use client";

import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import {
    languageToCountry,
    flagColors,
    nativeNames,
} from "@/lib/constants/languageConstants";

/**
 * Represents language proficiency data from the API
 */
interface LanguageData {
    /** Language name */
    language: string;
    /** Proficiency level */
    level: string;
    /** Number of people */
    count: number;
}

/**
 * Represents data for pie chart segments
 */
interface PieData {
    /** Name of the segment */
    name: string;
    /** Value of the segment */
    value: number;
}

/**
 * Props for the EnglishProficiencyChart component
 */
interface LanguageProficiencyChartProps {
    /** LGA code to fetch data for */
    lgaCode: string;
    /** Name of the LGA */
    lgaName: string;
}

/**
 * Interactive English proficiency chart component
 * Features:
 * - Pie chart visualization
 * - Language selection dropdown
 * - Country-specific color schemes
 * - Interactive hover effects
 * - Animated transitions
 * - Percentage labels
 * - Responsive design
 * - No data state handling
 */
const EnglishProficiencyChart = ({
    lgaCode,
    lgaName,
}: LanguageProficiencyChartProps) => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<string>("");
    const [languageData, setLanguageData] = useState<LanguageData[]>([]);
    const [availableLanguages, setAvailableLanguages] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `/api/lga/englishProficiency?lgaCode=${lgaCode}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();

                // Check if data is an array and has items
                if (!Array.isArray(data)) {
                    console.error("Invalid data format received:", data);
                    return;
                }

                setLanguageData(data);

                // Get unique languages and sort them
                const languages = Array.from(
                    new Set(data.map((d) => d.language))
                ).sort();
                setAvailableLanguages(languages);

                // Set initial selected language if none is selected
                if (languages.length > 0 && !selectedLanguage) {
                    setSelectedLanguage(languages[0]);
                }
            } catch (error) {
                console.error("Error fetching language data:", error);
                setLanguageData([]);
                setAvailableLanguages([]);
            }
        };

        if (lgaCode) {
            fetchData();
        }
    }, [lgaCode, selectedLanguage]);

    useEffect(() => {
        if (!selectedLanguage || !svgRef.current || !languageData.length)
            return;

        // Clear previous chart
        d3.select(svgRef.current).selectAll("*").remove();

        const filtered = languageData.filter(
            (d) => d.language === selectedLanguage
        );
        if (!filtered.some((d) => d.count > 0)) {
            // Show no data message in the SVG
            const svg = d3
                .select(svgRef.current)
                .attr("width", 640)
                .attr("height", 420)
                .attr("viewBox", "0 0 640 420")
                .attr("preserveAspectRatio", "xMidYMid meet");

            svg.append("text")
                .attr("x", 320)
                .attr("y", 210)
                .attr("text-anchor", "middle")
                .attr("dominant-baseline", "middle")
                .attr("font-size", "18px")
                .text(`No data for ${selectedLanguage} in ${lgaName}.`);

            return;
        }

        // Calculate percentages
        const total = filtered.reduce((sum, d) => sum + d.count, 0);
        const data = filtered.map((d) => ({
            name: d.level,
            value: (d.count / total) * 100,
        }));

        // Chart dimensions
        const container = svgRef.current?.parentElement;
        const width = container?.clientWidth || 800;
        const aspectRatio = 16 / 9;
        const height = width / aspectRatio;
        const radius = Math.min(width, height) / 2 - 80;
        const labelOffset = radius + 20;

        // Create SVG
        // Create SVG and center group
        const svg = d3
            .select(svgRef.current)
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", `0 0 ${width} ${height}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        // Color scale
        const cc =
            languageToCountry[
                selectedLanguage as keyof typeof languageToCountry
            ];
        const sliceColors =
            cc && flagColors[cc as keyof typeof flagColors]
                ? flagColors[cc as keyof typeof flagColors]
                : d3.schemeCategory10;
        const color = d3
            .scaleOrdinal<string>()
            .domain(data.map((d) => d.name))
            .range(sliceColors);

        // Determine line color based on flag colors
        const lineColor =
            cc &&
            flagColors[cc as keyof typeof flagColors] &&
            flagColors[cc as keyof typeof flagColors].length > 2
                ? "white"
                : "black";

        // Create pie layout
        const pie = d3
            .pie<PieData>()
            .sort(null)
            .value((d) => d.value);

        const arc = d3
            .arc<d3.PieArcDatum<PieData>>()
            .innerRadius(0)
            .outerRadius(radius);

        const outerArc = d3
            .arc<d3.PieArcDatum<PieData>>()
            .innerRadius(radius * 1.05)
            .outerRadius(radius * 1.05);

        const arcs = pie(data);

        // Add slices
        const paths = svg
            .selectAll("path")
            .data(arcs)
            .enter()
            .append("path")
            .attr("fill", (d) => color(d.data.name))
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .style("filter", "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))");

        // Animate slices with outline
        paths
            .transition()
            .duration(800)
            .attrTween("d", function (d) {
                const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
                return function (t) {
                    return arc(i(t)) || "";
                };
            });

        // Add hover effects
        paths
            .on("mouseover", function (event, d: d3.PieArcDatum<PieData>) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("transform", function () {
                        const centroid = arc.centroid(d);
                        return `translate(${
                            centroid[0] * 0.05
                        },${centroid[1] * 0.05})`;
                    })
                    .style(
                        "filter",
                        "drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.3))"
                    );
            })
            .on("mouseout", function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("transform", "translate(0,0)")
                    .style(
                        "filter",
                        "drop-shadow(0px 2px 3px rgba(0, 0, 0, 0.2))"
                    );
            });

        // Add lines with improved styling
        svg.selectAll("polyline")
            .data(arcs)
            .enter()
            .append("polyline")
            .attr("stroke", lineColor)
            .attr("fill", "none")
            .attr("stroke-width", 1.5)
            .attr("stroke-linecap", "round")
            .attr("opacity", 0.8)
            .attr("points", function (d) {
                const pos = outerArc.centroid(d);
                const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                pos[0] = labelOffset * (midAngle < Math.PI ? 1 : -1);
                const points = [arc.centroid(d), outerArc.centroid(d), pos];
                return points.map((p) => p.join(",")).join(" ");
            });

        // Add label text
        svg.selectAll("text")
            .data(arcs)
            .enter()
            .append("text")
            .attr("transform", (d) => {
                const pos = outerArc.centroid(d);
                const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                pos[0] = labelOffset * (midAngle < Math.PI ? 1 : -1);
                return `translate(${pos})`;
            })
            .attr("text-anchor", (d) => {
                const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                return midAngle < Math.PI ? "start" : "end";
            })
            .each(function (d) {
                const text = d3.select(this);
                text.append("tspan")
                    .attr("x", 0)
                    .attr("dy", "-0.5em")
                    .attr("font-weight", "bold")
                    .text(d.data.name);
                text.append("tspan")
                    .attr("x", 0)
                    .attr("dy", "1.2em")
                    .text(`${d.data.value.toFixed(1)}%`);
            });
    }, [selectedLanguage, languageData, lgaName]);

    return (
        <div className="w-full max-w-[800px] mx-auto p-4">
            <h2 className="text-xl font-bold text-center mb-4">
                English Proficiency in {lgaName}
            </h2>

            <div className="mb-2">
                <label
                    htmlFor="langSel"
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Select a language:
                </label>
                <select
                    id="langSel"
                    className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                >
                    {availableLanguages.map((lang) => (
                        <option key={lang} value={lang}>
                            {lang}{" "}
                            {nativeNames[lang as keyof typeof nativeNames] ||
                                ""}
                        </option>
                    ))}
                </select>
            </div>

            <div className="relative aspect-[16/9] w-full overflow-visible">
                <svg
                    ref={svgRef}
                    className="absolute top-0 left-0 w-full h-full"
                ></svg>
            </div>

            <div className="mt-2 text-sm text-gray-500 text-center">
                Data Source: ABS Census DataPacks
            </div>
        </div>
    );
};

export default EnglishProficiencyChart;
