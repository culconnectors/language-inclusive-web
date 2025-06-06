"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Navigation, RefreshCw } from "lucide-react";

/**
 * Represents a location prediction from the Google Places API
 */
export interface Prediction {
    /** Unique identifier for the place */
    place_id: string;
    /** Human-readable description of the location */
    description: string;
}

/**
 * Props for the LocationSearch component
 */
interface LocationSearchProps {
    /** Current search term */
    locationTerm: string;
    /** Function to update the search term */
    setLocationTerm: Dispatch<SetStateAction<string>>;
    /** List of location predictions */
    predictions: Prediction[];
    /** Loading state indicator */
    isLoading: boolean;
    /** Callback when a location is selected */
    onSelect: (placeId: string, description: string) => Promise<void>;
    /** Callback to get user's current location */
    onGetCurrentLocation: () => void;
    /** Callback to reset the search */
    onReset: () => void;
}

/**
 * Location search component with autocomplete functionality
 * Features:
 * - Google Places API integration
 * - Autocomplete predictions
 * - Current location detection
 * - Search reset capability
 * - Click outside to close predictions
 * - Loading state indicator
 */
export default function LocationSearch({
    locationTerm,
    setLocationTerm,
    predictions,
    isLoading,
    onSelect,
    onGetCurrentLocation,
    onReset,
}: LocationSearchProps) {
    const [showPredictions, setShowPredictions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowPredictions(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handlePredictionClick = async (
        placeId: string,
        description: string
    ) => {
        await onSelect(placeId, description);
        setShowPredictions(false);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="relative" ref={searchRef}>
                <input
                    type="text"
                    value={locationTerm}
                    onChange={(e) => {
                        setLocationTerm(e.target.value);
                        setShowPredictions(true);
                    }}
                    onFocus={() => setShowPredictions(true)}
                    placeholder="Enter a location..."
                    className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FABB20] focus:border-transparent outline-none"
                />
                {isLoading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FABB20]"></div>
                    </div>
                )}
                {showPredictions && predictions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white mt-1 border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {predictions.map((prediction) => (
                            <li
                                key={prediction.place_id}
                                onClick={() =>
                                    handlePredictionClick(
                                        prediction.place_id,
                                        prediction.description
                                    )
                                }
                                className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                            >
                                {prediction.description}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="flex gap-4">
                <button
                    onClick={onGetCurrentLocation}
                    className="px-6 py-2 bg-[#FABB20] text-white rounded-md hover:bg-[#FABB20]/90 transition-colors duration-300 flex items-center gap-2"
                >
                    <Navigation className="w-4 h-4" />
                    Current Location
                </button>
                <button
                    onClick={() => {
                        onReset();
                        setShowPredictions(false);
                    }}
                    className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-300 flex items-center gap-2"
                >
                    <RefreshCw className="w-4 h-4" />
                    New Search
                </button>
            </div>
        </div>
    );
}
