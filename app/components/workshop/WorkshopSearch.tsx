"use client";

import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
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
    location: {
        latitude: number;
        longitude: number;
    };
}

interface ApiResponse {
    workshops: Workshop[];
    totalItems: number;
}

const ITEMS_PER_PAGE = 10; // 10 workshops per page

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
        isLoading: isLocationLoading,
        selectedLocation,
        handlePredictionSelect,
        getCurrentLocation,
        resetLocation,
    } = useLocationSearch();

    const { data, isLoading } = useQuery<ApiResponse>({
        queryKey: [
            "workshops",
            selectedLocation?.lat,
            selectedLocation?.lng,
            distance,
        ],
        queryFn: async () => {
            if (!selectedLocation)
                return {
                    workshops: [],
                    totalItems: 0
                };
            const searchParams = new URLSearchParams({
                lat: selectedLocation.lat.toString(),
                lng: selectedLocation.lng.toString(),
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

    const workshops = data?.workshops || [];

    // Extract unique provider names from workshops
    const providerNames = useMemo(() => {
        return [
            ...new Set(
                workshops.map((workshop) => workshop.provider_name)
            ),
        ].sort();
    }, [workshops]);

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
        setCurrentPage(1); // Reset to first page when changing filters
    };

    // Filter workshops based on selected providers
    const filteredWorkshops = useMemo(() => {
        let filtered = workshops;

        // Apply provider filter
        if (selectedProviders.size > 0) {
            filtered = filtered.filter((workshop) =>
                selectedProviders.has(workshop.provider_name)
            );
        }

        return filtered;
    }, [workshops, selectedProviders]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredWorkshops.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedWorkshops = filteredWorkshops.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of workshops section
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 space-y-6">
                <LocationSearch
                    locationTerm={locationTerm}
                    setLocationTerm={setLocationTerm}
                    predictions={predictions}
                    isLoading={isLocationLoading}
                    onSelect={handlePredictionSelect}
                    onGetCurrentLocation={getCurrentLocation}
                    onReset={resetLocation}
                />

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
                                    setCurrentPage(1); // Reset to first page when distance changes
                                }}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-sm text-gray-600 min-w-[3rem] text-right">
                                {distance}km
                            </span>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-6">
                    {/* Providers */}
                    {providerNames.length > 0 && (
                        <div className="mb-6">
                            <p className="font-medium mb-2">Filter by Provider:</p>
                            <div className="flex flex-wrap gap-2">
                                {providerNames.map((provider) => (
                                    <button
                                        key={provider}
                                        onClick={() => handleProviderToggle(provider)}
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
            </div>

            <div className="space-y-6">
                <WorkshopList
                    coordinates={selectedLocation}
                    workshops={paginatedWorkshops}
                    pagination={{
                        currentPage,
                        totalPages,
                        totalItems: filteredWorkshops.length,
                        hasMore: currentPage < totalPages
                    }}
                    isLoading={isLoading}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
