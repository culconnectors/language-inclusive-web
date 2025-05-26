"use client";

import { useQuery } from "@tanstack/react-query";
import EventCard from "./event/EventCard";

/**
 * Represents an event from the Eventbrite API
 */
interface Event {
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
 * Featured events component that displays upcoming events in Melbourne
 * Features:
 * - Fetches events from Eventbrite API
 * - Displays events in a responsive grid
 * - Shows loading skeleton while fetching
 * - Limited to 4 featured events
 * - Uses React Query for data fetching
 */
export default function FeaturedEvents() {
    // Melbourne coordinates
    const melbourneCoords = {
        lat: -37.8136,
        lng: 144.9631,
    };

    const { data: events = [], isLoading } = useQuery({
        queryKey: ["featuredEvents", melbourneCoords],
        queryFn: async (): Promise<Event[]> => {
            const response = await fetch(
                `/api/eventBrite?lat=${melbourneCoords.lat}&lng=${melbourneCoords.lng}&radius=20`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch events");
            }
            const data = await response.json();
            return data.events.slice(0, 4); // Only take the first 4 events from the paginated response
        },
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
                    >
                        <div className="h-48 bg-gray-200" />
                        <div className="p-4 space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-3/4" />
                            <div className="space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                                <div className="h-4 bg-gray-200 rounded w-2/3" />
                            </div>
                            <div className="h-10 bg-gray-200 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {events.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
}
