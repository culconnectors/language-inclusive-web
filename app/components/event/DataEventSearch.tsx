// Project: event-search
/* File updated: 
    (2025-04-17) resetting location button
*/
"use client";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Navigation, RefreshCw, ArrowUpDown } from "lucide-react";
import EventList from "./EventList";
import LocationSearch from "../LocationSearch";
import { useLocationSearch } from "../../hooks/useLocationSearch";

/** Available sorting options for events */
type SortOption = "name-asc" | "name-desc" | "date-asc" | "date-desc";

/**
 * Represents an event from the Eventbrite API
 */
interface EventBriteResponse {
    /** Unique identifier for the event */
    id: string;
    /** Name of the event */
    name: string;
    /** Event description */
    description: string;
    /** URL to the event page */
    url: string;
    /** Event category */
    category: string;
    /** Event start time */
    start: {
        local: string;
    };
    /** Event end time */
    end: {
        local: string;
    };
    /** Venue information */
    venue: {
        name: string;
        address: {
            localized_address_display: string;
        };
    };
    /** Optional event logo */
    logo?: {
        url: string;
    };
}

/**
 * API response structure for events
 */
interface ApiResponse {
    /** List of events */
    events: EventBriteResponse[];
    /** Total number of events */
    totalItems: number;
}

/** Number of events to display per page */
const ITEMS_PER_PAGE = 12; // 12 events per page (3x4 grid)

/**
 * Event search component with advanced filtering and sorting
 * Features:
 * - Location-based search
 * - Category filtering
 * - Distance radius selection
 * - Current events filter
 * - Sorting options (name, date)
 * - Pagination
 * - Loading states
 * - Error handling
 */
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

    // State to manage current events filter
    const [showCurrentOnly, setShowCurrentOnly] = useState(false);

    // State to manage sort option
    const [sortBy, setSortBy] = useState<SortOption>("date-asc");

    // Fetch events from api endpoint based on selected location
    const { data, isLoading: isEventsLoading } = useQuery<ApiResponse>({
        queryKey: ["events", selectedLocation, distance],
        queryFn: async () => {
            if (!selectedLocation)
                return {
                    events: [],
                    totalItems: 0,
                };
            const response = await fetch(
                `/api/eventBrite?lat=${selectedLocation.lat}&lng=${selectedLocation.lng}&radius=${distance}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch events");
            }
            return response.json();
        },
        enabled: !!selectedLocation,
    });

    const events = data?.events || [];

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
        setCurrentPage(1); // Reset to first page when changing filters
    };

    // Filter events by selected categories and current status
    const filteredEvents = useMemo(() => {
        let filtered = events;

        // Apply category filter
        if (selectedCategories.size > 0) {
            filtered = filtered.filter(
                (event: EventBriteResponse) =>
                    event.category && selectedCategories.has(event.category)
            );
        }

        // Apply current events filter
        if (showCurrentOnly) {
            const now = new Date().toISOString();
            filtered = filtered.filter(
                (event: EventBriteResponse) =>
                    event.start.local <= now && event.end.local >= now
            );
        }

        return filtered;
    }, [events, selectedCategories, showCurrentOnly]);

    // Sort events based on selected sort option
    const sortedAndFilteredEvents = useMemo(() => {
        let sorted = [...filteredEvents];

        switch (sortBy) {
            case "name-asc":
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case "name-desc":
                sorted.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case "date-asc":
                sorted.sort(
                    (a, b) =>
                        new Date(a.start.local).getTime() -
                        new Date(b.start.local).getTime()
                );
                break;
            case "date-desc":
                sorted.sort(
                    (a, b) =>
                        new Date(b.start.local).getTime() -
                        new Date(a.start.local).getTime()
                );
                break;
        }

        return sorted;
    }, [filteredEvents, sortBy]);

    // Calculate pagination based on sorted events
    const totalPages = Math.ceil(
        sortedAndFilteredEvents.length / ITEMS_PER_PAGE
    );
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const paginatedEvents = sortedAndFilteredEvents.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of events section
        window.scrollTo({ top: 0, behavior: "smooth" });
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

                {!isEventsLoading && selectedLocation && (
                    <div className="flex flex-col gap-6">
                        {/* Sort Options */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <ArrowUpDown className="w-4 h-4 text-gray-600" />
                                <span className="text-sm font-medium text-gray-700">
                                    Sort by:
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => {
                                        setSortBy(
                                            sortBy === "name-asc"
                                                ? "name-desc"
                                                : "name-asc"
                                        );
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                                        sortBy.startsWith("name")
                                            ? "bg-[#FABB20] text-white hover:bg-[#FABB20]/90"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    Name{" "}
                                    {sortBy === "name-asc"
                                        ? "(A-Z)"
                                        : sortBy === "name-desc"
                                        ? "(Z-A)"
                                        : ""}
                                </button>
                                <button
                                    onClick={() => {
                                        setSortBy(
                                            sortBy === "date-asc"
                                                ? "date-desc"
                                                : "date-asc"
                                        );
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                                        sortBy.startsWith("date")
                                            ? "bg-[#FABB20] text-white hover:bg-[#FABB20]/90"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    Date{" "}
                                    {sortBy === "date-asc"
                                        ? "(Earliest)"
                                        : sortBy === "date-desc"
                                        ? "(Latest)"
                                        : ""}
                                </button>
                            </div>
                        </div>

                        {/* Current Events Toggle */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => {
                                    setShowCurrentOnly(!showCurrentOnly);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                                    showCurrentOnly
                                        ? "bg-[#FABB20] text-white hover:bg-[#FABB20]/90"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                Currently Happening
                            </button>
                            {showCurrentOnly && (
                                <span className="text-sm text-gray-600">
                                    Showing only events happening right now
                                </span>
                            )}
                        </div>

                        {/* Categories */}
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
                )}
            </div>

            <div className="space-y-6">
                <EventList
                    coordinates={selectedLocation}
                    events={paginatedEvents}
                    isLoading={isEventsLoading}
                />

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages}
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
