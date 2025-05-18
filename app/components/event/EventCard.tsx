"use client";

import Image from "next/image";
import { format } from "date-fns";

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

interface EventCardProps {
    event: Event;
}

export default function EventCard({ event }: EventCardProps) {
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "MMM d, yyyy h:mm a");
    };

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48 w-full">
                {event.logo?.url ? (
                    <Image
                        src={event.logo.url}
                        alt={event.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {event.name}
                </h3>
                <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">
                        {formatDate(event.start.local)}
                    </p>
                    <p className="text-sm text-gray-600 line-clamp-1">
                        {event.venue.name}
                    </p>
                </div>
                <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-[#FABB20] text-white py-2 px-4 rounded-md hover:bg-[#FABB20]/90 transition-colors duration-300"
                >
                    View Event
                </a>
            </div>
        </div>
    );
}
