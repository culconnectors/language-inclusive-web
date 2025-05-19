// Project: event-search
/* File updated: 
    (2025-04-17) resetting location button
*/
"use client";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Navigation, RefreshCw } from "lucide-react";
import EventList from "./EventList";
import LocationSearch from "../LocationSearch";
import { useLocationSearch } from "../../hooks/useLocationSearch";

// Define the API response type
interface EventBriteResponse {
    id: string;
    name: string;
    description: string;
    url: string;
    category: string;
    start: {
        local: string;
    };
    end: {
        local: string;
    };
    venue: {
        name: string;
        address: {
            localized_address_display: string;
        };
    };
    logo?: {
        url: string;
    };
}

interface PaginatedResponse {
    events: EventBriteResponse[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasMore: boolean;
    };
}

export default function DataEventSearch() {
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

    // State to manage selected categories
    const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
        new Set()
    );

    // State to manage distance radius
    const [distance, setDistance] = useState(20);

    // State to manage pagination
    const [currentPage, setCurrentPage] = useState(1);

    // Fetch events from api endpoint based on selected location
    const { data, isLoading: isEventsLoading } = useQuery<PaginatedResponse>({
        queryKey: ["events", selectedLocation, distance, currentPage],
        queryFn: async () => {
            if (!selectedLocation)
                return {
                    events: [],
                    pagination: {
                        currentPage: 1,
                        totalPages: 0,
                        totalItems: 0,
                        hasMore: false,
                    },
                };
            const response = await fetch(
                `/api/eventBrite?lat=${selectedLocation.lat}&lng=${selectedLocation.lng}&radius=${distance}&page=${currentPage}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch events");
            }
            return response.json();
        },
        enabled: !!selectedLocation,
    });

    const events = data?.events || [];
    const pagination = data?.pagination || {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        hasMore: false,
    };

    // Extract unique categories from events
    const allCategories: string[] = useMemo(() => {
        return [
            ...new Set(
                events
                    .map((event: EventBriteResponse) => event.category)
                    .filter((c: string | undefined): c is string => Boolean(c))
            ),
        ];
    }, [events]);

    // Handle checkbox toggle
    const handleCategoryToggle = (category: string) => {
        setSelectedCategories((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };

    // Filter events by selected categories
    const filteredEvents = useMemo(() => {
        if (selectedCategories.size === 0) return events;

        return events.filter(
            (event: EventBriteResponse) =>
                event.category && selectedCategories.has(event.category)
        );
    }, [events, selectedCategories]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <div className="flex flex-col gap-4 mb-4">
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
                                Showing events within {distance}km of selected
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

                {allCategories.length > 0 && (
                    <div className="mb-6">
                        <p className="font-medium mb-2">
                            Filter by Categories:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {allCategories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() =>
                                        handleCategoryToggle(category)
                                    }
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                                        selectedCategories.has(category)
                                            ? "bg-[#FABB20] text-white hover:bg-[#FABB20]/90"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-6">
                <EventList
                    coordinates={selectedLocation}
                    events={filteredEvents}
                    isLoading={isEventsLoading}
                />

                {pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            onClick={() =>
                                handlePageChange(pagination.currentPage - 1)
                            }
                            disabled={pagination.currentPage === 1}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {pagination.currentPage} of{" "}
                            {pagination.totalPages}
                        </span>
                        <button
                            onClick={() =>
                                handlePageChange(pagination.currentPage + 1)
                            }
                            disabled={!pagination.hasMore}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
