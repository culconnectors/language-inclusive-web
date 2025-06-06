"use client";

import Image from "next/image";
import { format } from "date-fns";
import { MapPin, Calendar } from "lucide-react";
import Link from "next/link";

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
 * Props for the EventCard component
 */
interface EventCardProps {
    /** Event data to display */
    event: Event;
}

/**
 * Checks if an event is currently happening
 * @param event - The event to check
 * @returns boolean indicating if the event is currently active
 */
function isEventHappening(event: Event): boolean {
    const now = new Date();
    const startDate = new Date(event.start.local);
    const endDate = new Date(event.end.local);
    return now >= startDate && now <= endDate;
}

/**
 * Event card component for displaying event information
 * Features:
 * - Event logo display
 * - Date and time formatting
 * - Venue information
 * - Category badge
 * - Currently happening indicator
 * - Interactive hover effects
 * - Link to event details
 */
export default function EventCard({ event }: EventCardProps) {
    const isHappening = isEventHappening(event);

    return (
        <Link
            href={`/events/${event.id}`}
            className={`block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full relative ${
                isHappening ? "border-2 border-[#FABB20]" : ""
            }`}
        >
            {isHappening && (
                <div className="absolute top-4 right-4 z-10">
                    <div className="bg-[#FABB20] text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                        Currently Happening
                    </div>
                </div>
            )}
            {event.logo?.url && (
                <div className="relative h-48">
                    <img
                        src={event.logo.url}
                        alt={event.name}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex-1 space-y-4">
                    <h3 className="text-lg font-semibold line-clamp-2">
                        {event.name}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                            <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                                <div>
                                    Starts:{" "}
                                    {format(
                                        new Date(event.start.local),
                                        "PPP 'at' p"
                                    )}
                                </div>
                                <div>
                                    Ends:{" "}
                                    {format(
                                        new Date(event.end.local),
                                        "PPP 'at' p"
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                                <div className="font-medium">
                                    {event.venue.name}
                                </div>
                                <div>
                                    {
                                        event.venue.address
                                            .localized_address_display
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {event.category && (
                    <div className="mb-4">
                        <div className="inline-block px-2 py-1 bg-gray-100 rounded-full text-xs">
                            {event.category}
                        </div>
                    </div>
                )}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        window.location.href = `/events/${event.id}`;
                    }}
                    className="w-full mt-4 bg-[#FABB20] text-white py-2 px-4 rounded-md hover:bg-[#FABB20]/90 transition-colors"
                >
                    View Event
                </button>
            </div>
        </Link>
    );
}
