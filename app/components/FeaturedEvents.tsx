"use client";

import { useQuery } from "@tanstack/react-query";
import EventCard from "./event/EventCard";

interface Event {
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
                `/api/eventBrite?lat=${melbourneCoords.lat}&lng=${melbourneCoords.lng}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch events");
            }
            const data = await response.json();
            return data.slice(0, 4); // Only take the first 4 events
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
