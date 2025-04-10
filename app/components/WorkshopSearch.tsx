"use client";

import { useQuery } from "@tanstack/react-query";
import { MapPin, Navigation } from "lucide-react";
import WorkshopList from "./WorkshopList";
import LocationSearch from "./LocationSearch";
import { useLocationSearch } from "../hooks/useLocationSearch";

interface Workshop {
    id: string;
    name: string;
    provider_name: string;
    url: string;
    logo?: {
        url: string;
    };
}

export default function WorkshopSearch() {
    const {
        locationTerm,
        setLocationTerm,
        predictions,
        isLoading: isLocationLoading,
        selectedLocation,
        handlePredictionSelect,
        getCurrentLocation,
    } = useLocationSearch();

    const { data: workshops = [], isLoading: isWorkshopsLoading } = useQuery<
        Workshop[]
    >({
        queryKey: ["workshops", selectedLocation],
        queryFn: async () => {
            if (!selectedLocation) return [];
            const response = await fetch(
                `/api/workshops?lat=${selectedLocation.lat}&lng=${selectedLocation.lng}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch workshops");
            }
            return response.json();
        },
        enabled: !!selectedLocation,
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex gap-4 mb-4">
                    <div className="flex-1">
                        <LocationSearch
                            onLocationSelect={() => {}}
                            predictions={predictions}
                            loading={isLocationLoading}
                            locationTerm={locationTerm}
                            onLocationTermChange={setLocationTerm}
                            onPredictionSelect={handlePredictionSelect}
                        />
                    </div>
                    <button
                        onClick={getCurrentLocation}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-2"
                    >
                        <Navigation className="w-4 h-4" />
                        Current Location
                    </button>
                </div>
                {selectedLocation && (
                    <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span>
                            Showing language workshops near selected location
                        </span>
                    </div>
                )}
            </div>
            <WorkshopList
                coordinates={selectedLocation}
                workshops={workshops}
                isLoading={isWorkshopsLoading}
            />
        </div>
    );
}
