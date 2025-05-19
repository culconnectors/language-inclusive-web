"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/app/hooks/useTheme";

interface LocationSearchProps {
    onLocationSelect: (coords: { lat: number; lng: number }) => void;
    predictions: Array<{ description: string; place_id: string }>;
    loading: boolean;
    locationTerm: string;
    onLocationTermChange: (value: string) => void;
    onPredictionSelect: (placeId: string, description: string) => void;
}

export default function LocationSearch({
    onLocationSelect,
    predictions,
    loading,
    locationTerm,
    onLocationTermChange,
    onPredictionSelect,
}: LocationSearchProps) {
    const [inputValue, setInputValue] = useState(locationTerm);
    const [showPredictions, setShowPredictions] = useState(false);
    const { isDarkMode } = useTheme();

    // Sync inputValue with locationTerm
    useEffect(() => {
        setInputValue(locationTerm);
    }, [locationTerm]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        onLocationTermChange(value);
        setShowPredictions(true);
    };

    const handlePredictionSelect = (placeId: string, description: string) => {
        setInputValue(description);
        onPredictionSelect(placeId, description);
        setShowPredictions(false);
    };

    return (
        <div className="relative">
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setShowPredictions(true)}
                placeholder="Enter a location"
                className={`w-full px-4 py-2 rounded-md border ${
                    isDarkMode
                        ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } focus:outline-none focus:ring-2 focus:ring-[#FABB20] focus:border-transparent`}
            />

            {showPredictions && predictions.length > 0 && (
                <div
                    className={`absolute z-10 w-full mt-1 ${
                        isDarkMode
                            ? "bg-gray-800 border-gray-700"
                            : "bg-white border-gray-300"
                    } border rounded-md shadow-lg`}
                >
                    {predictions.map((prediction) => (
                        <button
                            key={prediction.place_id}
                            onClick={() =>
                                handlePredictionSelect(
                                    prediction.place_id,
                                    prediction.description
                                )
                            }
                            className={`w-full px-4 py-2 text-left ${
                                isDarkMode
                                    ? "text-gray-100 hover:bg-gray-700"
                                    : "text-gray-900 hover:bg-gray-100"
                            }`}
                        >
                            {prediction.description}
                        </button>
                    ))}
                </div>
            )}

            {loading && (
                <div className="absolute right-3 top-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FABB20]"></div>
                </div>
            )}
        </div>
    );
}
