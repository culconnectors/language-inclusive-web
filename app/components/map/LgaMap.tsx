"use client";

import Map, { Layer, Source, Popup, MapRef } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useState, useCallback, useEffect, useRef } from "react";
import * as turf from "@turf/turf";
import { StatisticsMap } from "./statisticsMap";
import ChartGenerator from "./chartGenerator";
import LgaSidebar from "./LgaSidebar";
import EnglishProficiencyChart from "./englishProficiencyChart";
import { bbox, center } from "@turf/turf";
import CouncilInfoCard from "./CouncilInfoCard";
import LandmarkContent from "./LandmarkContent";
import type { MapLayerMouseEvent } from "react-map-gl";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

/**
 * Interface for information about the currently hovered LGA on the map.
 * @property {string} lgaCode - The code of the hovered LGA.
 * @property {string} lgaName - The name of the hovered LGA.
 * @property {number} x - The x-coordinate of the mouse pointer.
 * @property {number} y - The y-coordinate of the mouse pointer.
 */
interface HoverInfo {
    lgaCode: string;
    lgaName: string;
    x: number;
    y: number;
}

/**
 * Interface for a single statistic data point for an LGA.
 * @property {string} lga_code - The code of the LGA.
 * @property {number} value - The value of the statistic for the LGA.
 */
interface StatisticData {
    lga_code: string;
    value: number;
}

/**
 * Interface for a single chart data entry (nationality or language).
 * @property {string} [nationality] - The nationality (if applicable).
 * @property {string} [language] - The language (if applicable).
 * @property {number} count - The count for this entry.
 */
interface ChartData {
    nationality?: string;
    language?: string;
    count: number;
}

/**
 * Props for the LgaMap component.
 * @property {function} [onLgaSelect] - Optional callback invoked when an LGA is selected.
 */
interface LgaMapProps {
    onLgaSelect?: (lgaCode: string) => void;
}

/**
 * Main interactive map component for displaying LGAs and their associated data.
 *
 * - Renders a map visualization with selectable LGAs.
 * - Supports statistics, nationalities, and language modes.
 * - Fetches and displays data overlays and charts.
 * - Handles user interaction and selection.
 *
 * @param {LgaMapProps} props - Component props.
 * @returns {JSX.Element}
 */
const LgaMap = ({ onLgaSelect }: LgaMapProps) => {
    // Reference to the Map instance for imperative actions
    const mapRef = useRef<MapRef>(null);

    // State for currently hovered LGA info (for tooltip display)
    const [hoveredLgaInfo, setHoveredLgaInfo] = useState<HoverInfo | null>(
        null
    );

    // Current mode: 'statistics', 'nationalities', or 'language'
    const [mode, setMode] = useState<
        "statistics" | "nationalities" | "language"
    >("statistics");

    // Currently selected statistic key (for statistics mode)
    const [selectedStatistic, setSelectedStatistic] = useState("");

    // Data for the selected statistic (array of LGA values)
    const [statisticData, setStatisticData] = useState<StatisticData[]>([]);

    // Data for the chart (nationalities or languages)
    const [chartData, setChartData] = useState<ChartData[]>([]);

    // Currently selected LGA code and name
    const [selectedLgaCode, setSelectedLgaCode] = useState<string | null>(null);
    const [selectedLgaName, setSelectedLgaName] = useState<string>("");

    // Controls visibility of the CouncilInfoCard
    const [showCouncilInfo, setShowCouncilInfo] = useState(false);

    // Data for the landmarks
    const [landmarks, setLandmarks] = useState<any[]>([]);

    // Controls visibility of the landmarks
    const [showLandmarks, setShowLandmarks] = useState(false);

    // State for selected landmark for popup
    const [selectedLandmark, setSelectedLandmark] = useState<any | null>(null);

    /**
     * Fetches statistic data for the selected statistic when mode/statistic changes.
     * Only runs in 'statistics' mode and when a statistic is selected.
     */
    useEffect(() => {
        const fetchStatisticData = async () => {
            try {
                const response = await fetch(
                    `/api/lga/statisticData?stat=${selectedStatistic}`
                );
                const data = await response.json();
                setStatisticData(data);
            } catch (error) {
                console.error("Failed to fetch statistic data:", error);
            }
        };

        if (mode === "statistics" && selectedStatistic) {
            fetchStatisticData();
        }
    }, [selectedStatistic, mode]);

    /**
     * Fetches chart data (nationalities or languages) for the selected LGA and mode.
     * Skips fetching if no LGA is selected or if in 'statistics' mode.
     */
    useEffect(() => {
        const fetchChartData = async () => {
            if (!selectedLgaCode || mode === "statistics") {
                console.debug("Skipping chart data fetch:", {
                    selectedLgaCode,
                    mode,
                });
                return;
            }

            try {
                console.debug("Fetching chart data:", {
                    selectedLgaCode,
                    mode,
                });
                let endpoint;
                switch (mode) {
                    case "nationalities":
                        endpoint = "nationalitiesData";
                        break;
                    case "language":
                        endpoint = "languagesData";
                        break;
                    default:
                        console.warn("Unknown mode:", mode);
                        return;
                }

                const response = await fetch(
                    `/api/lga/${endpoint}?lgaCode=${selectedLgaCode}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.debug("Chart data received:", {
                    dataLength: data.length,
                    firstItem: data[0],
                });
                setChartData(data);
            } catch (error) {
                console.error(`Failed to fetch ${mode} data:`, error);
                setChartData([]);
            }
        };

        fetchChartData();
    }, [selectedLgaCode, mode]);

    /**
     * Debug logging for chart render conditions.
     */
    useEffect(() => {
        console.debug("Chart render conditions:", {
            hasSelectedLgaCode: !!selectedLgaCode,
            mode,
            chartDataLength: chartData.length,
            selectedLgaName,
            shouldShowChart:
                selectedLgaCode &&
                mode !== "statistics" &&
                chartData.length > 0,
        });
    }, [selectedLgaCode, mode, chartData, selectedLgaName]);

    // Fetch landmarks when the landmarks layer is toggled on
    useEffect(() => {
        const fetchLandmarks = async () => {
            try {
                // Call the new GET_landmarks function via the API endpoint
                const res = await fetch("/api/lga/landmarks");
                if (!res.ok) throw new Error("Failed to fetch");
                const data = await res.json();
                setLandmarks(data);
            } catch (err) {
                console.error("Error fetching landmarks:", err);
            }
        };

        if (showLandmarks && landmarks.length === 0) {
            fetchLandmarks();
        }
    }, [showLandmarks]);

    // Log selectedLandmark to console for debugging
    useEffect(() => {
        if (showLandmarks) {
            if (selectedLandmark) {
                console.log("Selected landmark:", selectedLandmark);
            } else {
                console.log("No landmark selected. Landmarks data:", landmarks);
            }
        }
    }, [selectedLandmark, showLandmarks, landmarks]);

    // Landmark click event handler for map
    useEffect(() => {
        const map = mapRef.current?.getMap?.();
        if (!map || !showLandmarks || !landmarks.length) return;

        const handleClick = (e: any) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: ["landmark-points"],
            });
            if (features.length > 0) {
                const landmark = features[0].properties;
                let longitude, latitude;
                const geometry = features[0].geometry;
                if (
                    geometry &&
                    geometry.type === "Point" &&
                    Array.isArray(geometry.coordinates)
                ) {
                    longitude = geometry.coordinates[0];
                    latitude = geometry.coordinates[1];
                }
                if (landmark && landmark.landmark_name) {
                    console.log("Clicked landmark:", landmark.landmark_name);
                }
                setSelectedLandmark({
                    ...landmark,
                    longitude,
                    latitude,
                });
            }
        };
        map.on("click", "landmark-points", handleClick);
        return () => {
            map.off("click", "landmark-points", handleClick);
        };
    }, [showLandmarks, landmarks]);

    // Remove handleMapLoad and use useEffect for LGA event handlers
    useEffect(() => {
        const map = mapRef.current?.getMap?.();
        if (!map) return;

        // Handler functions
        const mouseMoveHandler = (e: any) => {
            if (e.features?.length && e.point) {
                const feature = e.features[0];
                const lgaCode =
                    feature.properties?.lga_code ||
                    feature.properties?.LGA_CODE;
                const lgaName =
                    feature.properties?.lga_name ||
                    feature.properties?.LGA_NAME;
                if (lgaCode && lgaName) {
                    setHoveredLgaInfo({
                        lgaCode,
                        lgaName,
                        x: e.point.x,
                        y: e.point.y,
                    });
                    map.getCanvas().style.cursor = "pointer";
                }
            }
        };
        const mouseLeaveHandler = () => {
            map.getCanvas().style.cursor = "";
            setHoveredLgaInfo(null);
        };
        const clickHandler = (e: any) => {
            if (e.features?.length) {
                const feature = e.features[0];
                const lgaCode =
                    feature.properties?.lga_code ||
                    feature.properties?.LGA_CODE;
                const lgaName =
                    feature.properties?.lga_name ||
                    feature.properties?.LGA_NAME;
                if (lgaCode && lgaName) {
                    console.debug("LGA selected:", { lgaCode, lgaName });
                    setSelectedLgaCode(lgaCode);
                    setSelectedLgaName(lgaName);
                    setShowCouncilInfo(true);
                    onLgaSelect?.(lgaCode);
                    if (feature.geometry) {
                        try {
                            const geoFeature = turf.feature(feature.geometry);
                            const bounds = turf.bbox(geoFeature);
                            const centerPoint = turf.center(geoFeature);
                            if (mapRef.current) {
                                mapRef.current.resize();
                                mapRef.current.fitBounds(
                                    [
                                        [bounds[0], bounds[1]],
                                        [bounds[2], bounds[3]],
                                    ],
                                    {
                                        padding: 80,
                                        duration: 1200,
                                        essential: true,
                                    }
                                );
                            }
                        } catch (error) {
                            console.error(
                                "Error computing bounds or center:",
                                error
                            );
                        }
                    } else {
                        console.warn(
                            "Missing geometry in clicked feature:",
                            feature
                        );
                    }
                }
            }
        };

        if (!showLandmarks) {
            map.on("mousemove", "vic-lga-cleaned-5yz92t", mouseMoveHandler);
            map.on("mouseleave", "vic-lga-cleaned-5yz92t", mouseLeaveHandler);
            map.on("click", "vic-lga-cleaned-5yz92t", clickHandler);
        }
        // Cleanup
        return () => {
            map.off("mousemove", "vic-lga-cleaned-5yz92t", mouseMoveHandler);
            map.off("mouseleave", "vic-lga-cleaned-5yz92t", mouseLeaveHandler);
            map.off("click", "vic-lga-cleaned-5yz92t", clickHandler);
        };
    }, [showLandmarks, mapRef, onLgaSelect]);

    return (
        <div className="flex flex-col gap-4">
            <LgaSidebar
                onModeChange={(newMode) => {
                    console.debug("Mode changed:", {
                        newMode,
                        currentMode: mode,
                    });
                    setMode(newMode);
                    setSelectedLgaCode(null);
                    setSelectedLgaName("");
                    setShowCouncilInfo(false);
                }}
                onStatisticSelect={setSelectedStatistic}
                onToggleLandmarks={setShowLandmarks}
                showLandmarks={showLandmarks}
            />

            <div
                className={`w-full ${
                    selectedLgaCode &&
                    mode !== "statistics" &&
                    chartData.length > 0
                        ? "grid grid-cols-2 gap-4"
                        : "flex flex-col gap-4"
                }`}
            >
                <div
                    className={`${
                        selectedLgaCode &&
                        mode !== "statistics" &&
                        chartData.length > 0
                            ? "h-[600px]"
                            : "w-full h-[600px]"
                    } rounded-lg overflow-hidden shadow-lg relative`}
                >
                    <Map
                        ref={mapRef}
                        initialViewState={{
                            latitude: -37.5,
                            longitude: 144.5,
                            zoom: 6,
                        }}
                        mapStyle="mapbox://styles/mlee-0159/cm9tzg62f00fu01sp105a9d5v"
                        mapboxAccessToken={MAPBOX_TOKEN}
                        style={{ width: "100%", height: "100%" }}
                        interactiveLayerIds={
                            showLandmarks ? [] : ["vic-lga-cleaned-5yz92t"]
                        }
                    >
                        {/* StatisticsMap and LGA highlight layers only when not showing landmarks */}
                        {!showLandmarks &&
                            mode === "statistics" &&
                            selectedStatistic && (
                                <StatisticsMap statKey={selectedStatistic} />
                            )}

                        {/* Selected LGA highlight layer */}
                        {!showLandmarks && selectedLgaCode && (
                            <Layer
                                id="selected-lga"
                                type="fill"
                                source="composite"
                                source-layer="vic_lga_cleaned-5yz92t"
                                paint={{
                                    "fill-color": "#4A90E2",
                                    "fill-outline-color": "#2171C7",
                                    "fill-opacity": 0.6,
                                }}
                                filter={[
                                    "==",
                                    ["get", "lga_code"],
                                    selectedLgaCode,
                                ]}
                            />
                        )}
                        {/* Hover highlight layer */}
                        {!showLandmarks && hoveredLgaInfo && (
                            <>
                                <Layer
                                    id="hover-highlight"
                                    type="fill"
                                    source="composite"
                                    source-layer="vic_lga_cleaned-5yz92t"
                                    paint={{
                                        "fill-color": "#afb1de",
                                        "fill-outline-color": "#06072b",
                                        "fill-opacity": 0.4,
                                    }}
                                    filter={[
                                        "==",
                                        ["get", "lga_code"],
                                        hoveredLgaInfo.lgaCode,
                                    ]}
                                />
                                <div
                                    style={{
                                        position: "absolute",
                                        left: hoveredLgaInfo.x,
                                        top: hoveredLgaInfo.y,
                                        transform: "translate(-50%, -100%)",
                                        backgroundColor: "white",
                                        padding: "8px",
                                        borderRadius: "4px",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                                        pointerEvents: "none",
                                        zIndex: 1,
                                    }}
                                >
                                    <span className="font-medium">
                                        {hoveredLgaInfo.lgaName}
                                    </span>
                                    {mode === "statistics" &&
                                        selectedStatistic &&
                                        statisticData.length > 0 && (
                                            <div className="text-sm text-gray-600">
                                                {statisticData
                                                    .find(
                                                        (d) =>
                                                            d.lga_code ===
                                                            hoveredLgaInfo.lgaCode
                                                    )
                                                    ?.value.toLocaleString()}
                                            </div>
                                        )}
                                </div>
                            </>
                        )}

                        {/* Landmarks layer only when showLandmarks is true */}
                        {showLandmarks && landmarks.length > 0 && (
                            <>
                                <Source
                                    id="landmarks"
                                    type="geojson"
                                    data={{
                                        type: "FeatureCollection",
                                        features: landmarks.map((lm) => ({
                                            type: "Feature",
                                            geometry: {
                                                type: "Point",
                                                coordinates: [
                                                    lm.longitude,
                                                    lm.latitude,
                                                ],
                                            },
                                            properties: {
                                                ...lm,
                                            },
                                        })),
                                    }}
                                >
                                    <Layer
                                        id="landmark-points"
                                        type="circle"
                                        paint={{
                                            "circle-radius": 6,
                                            "circle-color": "#E91E63",
                                            "circle-stroke-width": 2,
                                            "circle-stroke-color": "#fff",
                                        }}
                                    />
                                </Source>

                                {/* Single Popup for selected landmark */}
                                {selectedLandmark && (
                                    <Popup
                                        longitude={selectedLandmark.longitude}
                                        latitude={selectedLandmark.latitude}
                                        onClose={() =>
                                            setSelectedLandmark(null)
                                        }
                                        closeOnClick={false}
                                        focusAfterOpen={false}
                                        anchor="bottom"
                                        className="z-[9999] popup-landmark"
                                    >
                                        <LandmarkContent
                                            name={
                                                selectedLandmark.landmark_name
                                            }
                                            description={
                                                selectedLandmark.landmark_description
                                            }
                                            website={selectedLandmark.ilms_url}
                                            type={
                                                selectedLandmark.type
                                                    ?.landmark_type || ""
                                            }
                                        />
                                    </Popup>
                                )}
                            </>
                        )}
                    </Map>
                </div>

                {/* Chart Section */}
                {selectedLgaCode && mode !== "statistics" && (
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        {mode === "language" ? (
                            <EnglishProficiencyChart
                                lgaCode={selectedLgaCode}
                                lgaName={selectedLgaName}
                            />
                        ) : (
                            <ChartGenerator
                                data={chartData}
                                title={`${
                                    mode === "nationalities"
                                        ? "Nationalities"
                                        : "Languages"
                                } in ${selectedLgaName}`}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Council Info Card */}
            {!showLandmarks && (
                <CouncilInfoCard
                    lgaCode={
                        showCouncilInfo && mode === "statistics"
                            ? selectedLgaCode
                            : null
                    }
                    onClose={() => setShowCouncilInfo(false)}
                />
            )}
        </div>
    );
};

export default LgaMap;
