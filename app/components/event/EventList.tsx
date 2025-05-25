"use client";

import EventCard from "./EventCard";
import { MapPin, Calendar } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";

interface Coordinates {
    lat: number;
    lng: number;
}

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

interface EventListProps {
    coordinates: Coordinates | null;
    events: Event[];
    isLoading: boolean;
}

function LoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
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

function isEventHappening(event: Event): boolean {
    const now = new Date();
    const startDate = new Date(event.start.local);
    const endDate = new Date(event.end.local);
    return now >= startDate && now <= endDate;
}

export default function EventList({
    coordinates,
    events,
    isLoading,
}: EventListProps) {
    if (!coordinates) {
        return null;
    }

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (!events.length) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                    <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                    </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    No Events Found
                </h2>
                <p className="text-gray-600">
                    Try adjusting your search or location to find events.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((event) => {
                const isHappening = isEventHappening(event);
                return (
                    <Link
                        key={event.id}
                        href={`/events/${event.id}`}
                        className={`block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full relative ${
                            isHappening ? 'border-2 border-[#FABB20]' : ''
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
                                                Starts: {format(new Date(event.start.local), "PPP 'at' p")}
                                            </div>
                                            <div>
                                                Ends: {format(new Date(event.end.local), "PPP 'at' p")}
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
            })}
        </div>
    );
}
