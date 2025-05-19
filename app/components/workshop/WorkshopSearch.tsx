"use client";

import { useQuery } from "@tanstack/react-query";
import { MapPin, Navigation, RefreshCw } from "lucide-react";
import { useState, useMemo } from "react";
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
    const [selectedProviders, setSelectedProviders] = useState<Set<string>>(
        new Set()
    );
    const [distance, setDistance] = useState(20);

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
            distance,
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
                radius: distance.toString(),
            });
            const response = await fetch(`/api/workshops?${searchParams}`);
            if (!response.ok) {
                throw new Error("Failed to fetch courses");
            }
            return response.json();
        },
        enabled: !!selectedLocation,
    });

    // Extract unique provider names from workshops
    const providerNames = useMemo(() => {
        if (!data?.workshops) return [];
        return [
            ...new Set(
                data.workshops.map((workshop) => workshop.provider_name)
            ),
        ].sort();
    }, [data?.workshops]);

    // Handle checkbox toggle
    const handleProviderToggle = (providerName: string) => {
        setSelectedProviders((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(providerName)) {
                newSet.delete(providerName);
            } else {
                newSet.add(providerName);
            }
            return newSet;
        });
    };

    // Filter workshops based on selected providers
    const filteredWorkshops = useMemo(() => {
        if (!data?.workshops) return [];
        if (selectedProviders.size === 0) return data.workshops;
        return data.workshops.filter((workshop) =>
            selectedProviders.has(workshop.provider_name)
        );
    }, [data?.workshops, selectedProviders]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex flex-col gap-4 mb-4">
                    <div className="flex-1">
                        <LocationSearch
                            locationTerm={locationTerm}
                            onLocationTermChange={setLocationTerm}
                            predictions={predictions}
                            loading={isLoadingLocation}
                            onPredictionSelect={handlePredictionSelect}
                            onLocationSelect={() => {}}
                        />
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={getCurrentLocation}
                            className="px-6 py-2 bg-[#FABB20] text-white rounded-md hover:bg-[#FABB20]/90 transition-colors duration-300 flex items-center gap-2"
                        >
                            <Navigation className="w-4 h-4" />
                            Current Location
                        </button>
                        <button
                            onClick={resetLocation}
                            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-300 flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            New Search
                        </button>
                    </div>
                </div>

                {selectedLocation && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>
                                Showing courses within {distance}km of selected
                                location
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={distance}
                                onChange={(e) => {
                                    setDistance(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-sm text-gray-600 min-w-[3rem] text-right">
                                {distance}km
                            </span>
                        </div>
                    </div>
                )}

                {providerNames.length > 0 && (
                    <div className="mb-6">
                        <p className="font-medium mb-2">Filter by Provider:</p>
                        <div className="flex flex-wrap gap-2">
                            {providerNames.map((provider) => (
                                <button
                                    key={provider}
                                    onClick={() =>
                                        handleProviderToggle(provider)
                                    }
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                                        selectedProviders.has(provider)
                                            ? "bg-[#FABB20] text-white hover:bg-[#FABB20]/90"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {provider}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <WorkshopList
                    coordinates={selectedLocation}
                    workshops={filteredWorkshops}
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
        </div>
    );
}
