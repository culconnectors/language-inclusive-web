"use client";

import { useQuery } from "@tanstack/react-query";
import { MapPin, Navigation } from "lucide-react";
import { useState } from "react";
import WorkshopList from "./WorkshopList";
import LocationSearch from "../LocationSearch";
import { useLocationSearch } from "../../hooks/useLocationSearch";
import WorkshopCard from "./WorkshopCard";

interface Workshop {
    id: string;
    name: string;
    provider_name: string;
    description: string;
    url: string;
}

interface PaginatedResponse {
    workshops: Workshop[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasMore: boolean;
    };
}

export default function WorkshopSearch() {
    const [currentPage, setCurrentPage] = useState(1);
    const {
        locationTerm,
        setLocationTerm,
        predictions,
        isLoading: isLoadingLocation,
        selectedLocation,
        selectedPostcode,
        handlePredictionSelect,
        getCurrentLocation,
        resetLocation,
    } = useLocationSearch();

    const { data, isLoading } = useQuery<PaginatedResponse>({
        queryKey: [
            "workshops",
            selectedLocation?.lat,
            selectedLocation?.lng,
            currentPage,
        ],
        queryFn: async () => {
            if (!selectedLocation)
                return {
                    workshops: [],
                    pagination: {
                        currentPage: 1,
                        totalPages: 0,
                        totalItems: 0,
                        hasMore: false,
                    },
                };
            const searchParams = new URLSearchParams({
                lat: selectedLocation.lat.toString(),
                lng: selectedLocation.lng.toString(),
                page: currentPage.toString(),
            });
            const response = await fetch(`/api/workshops?${searchParams}`);
            if (!response.ok) {
                throw new Error("Failed to fetch courses");
            }
            return response.json();
        },
        enabled: !!selectedLocation,
    });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <LocationSearch
                    locationTerm={locationTerm}
                    onLocationTermChange={setLocationTerm}
                    predictions={predictions}
                    loading={isLoadingLocation}
                    onPredictionSelect={handlePredictionSelect}
                    onLocationSelect={() => {}}
                />
                <button
                    onClick={getCurrentLocation}
                    disabled={isLoadingLocation}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                    <Navigation className="w-4 h-4" />
                    <span>Use my location</span>
                </button>
            </div>

            {selectedLocation && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>Showing courses near {locationTerm}</span>
                </div>
            )}

            <WorkshopList
                coordinates={selectedLocation}
                workshops={data?.workshops || []}
                pagination={
                    data?.pagination || {
                        currentPage: 1,
                        totalPages: 0,
                        totalItems: 0,
                        hasMore: false,
                    }
                }
                isLoading={isLoading}
                onPageChange={handlePageChange}
            />
        </div>
    );
}
