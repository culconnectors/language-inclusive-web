import { format } from "date-fns";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getEventById } from "@/lib/services/eventService";
import Navbar from "@/app/components/Navbar";

export default async function EventPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const event = await getEventById(id);

    if (!event) {
        notFound();
    }

    const formatDate = (date: Date) => {
        // Parse the date string directly without timezone conversion
        const dateString = date.toISOString();
        const [datePart, timePart] = dateString.split("T");
        const [year, month, day] = datePart.split("-");
        const [hours, minutes] = timePart.split(":");
        const parsedDate = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hours),
            parseInt(minutes)
        );
        return format(parsedDate, "EEEE, MMMM d, yyyy 'at' h:mm a");
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            {/* Hero Section */}
            <div className="bg-[#0A0F1D]">
                {/* Image Section */}
                <div className="max-w-5xl mx-auto">
                    <div className="relative w-full aspect-video">
                        {event.logo?.url ? (
                            <Image
                                src={event.logo.url}
                                alt={event.event_name}
                                fill
                                className="object-contain"
                                sizes="(max-width: 1024px) 100vw, 1024px"
                                priority
                            />
                        ) : (
                            <div className="w-full h-full bg-[#1A1F2D] flex items-center justify-center">
                                <svg
                                    className="w-24 h-24 text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        )}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0F1D]" />
                    </div>
                </div>

                {/* Content Section */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
                    <div className="bg-[#1A1F2D]/80 backdrop-blur-sm rounded-xl p-8 text-white">
                        <div className="flex items-center gap-3 mb-4">
                            {event.is_free_event && (
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-green-500/20 text-green-400">
                                    Free Event
                                </span>
                            )}
                            {event.community_friendly && (
                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-blue-500/20 text-blue-400">
                                    Community Friendly
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                            {event.event_name}
                        </h1>

                        <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
                            <div className="flex items-center gap-2">
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                <span>{formatDate(event.start_datetime)}</span>
                            </div>

                            {event.venue && (
                                <div className="flex items-center gap-2">
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    <span>{event.venue.venue_name}</span>
                                </div>
                            )}

                            {event.event_url && (
                                <a
                                    href={event.event_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-[#FABB20] text-white py-3 px-8 rounded-xl font-semibold hover:bg-[#FABB20]/90 transition-colors ml-auto"
                                >
                                    View External Page
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="prose prose-lg max-w-none">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">
                                    About the Event
                                </h2>
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: event.event_description,
                                    }}
                                />

                                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <svg
                                            className="w-6 h-6 text-blue-500 mt-0.5"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <div>
                                            <p className="text-blue-900 font-medium">
                                                Want to book or learn more?
                                            </p>
                                            <p className="text-blue-700 mt-1">
                                                Please visit the external event
                                                page using the button above.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Date & Time */}
                        <div className="bg-gray-50 rounded-xl p-8 min-h-[160px]">
                            <h3 className="text-xl font-semibold mb-4">
                                Date and Time
                            </h3>
                            <div className="space-y-3">
                                <p className="text-gray-600 whitespace-nowrap">
                                    <span className="font-medium">Start:</span>{" "}
                                    {formatDate(event.start_datetime)}
                                </p>
                                <p className="text-gray-600 whitespace-nowrap">
                                    <span className="font-medium">End:</span>{" "}
                                    {formatDate(event.end_datetime)}
                                </p>
                            </div>
                        </div>

                        {/* Location */}
                        {event.venue && (
                            <div className="bg-gray-50 rounded-xl p-8 min-h-[160px]">
                                <h3 className="text-xl font-semibold mb-4">
                                    Location
                                </h3>
                                <div className="space-y-3">
                                    <p className="font-medium">
                                        {event.venue.venue_name}
                                    </p>
                                    <p className="text-gray-600">
                                        {event.venue.venue_address},{" "}
                                        {event.venue.venue_city}
                                        {event.venue.venue_postcode &&
                                            ` ${event.venue.venue_postcode}`}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Organizer */}
                        {event.organizer && (
                            <div className="bg-gray-50 rounded-xl p-8 min-h-[160px]">
                                <h3 className="text-xl font-semibold mb-4">
                                    Organizer
                                </h3>
                                <div className="space-y-3">
                                    <p className="font-medium">
                                        {event.organizer.organizer_name}
                                    </p>
                                    {event.organizer.organizer_url && (
                                        <a
                                            href={event.organizer.organizer_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[#FABB20] hover:underline"
                                        >
                                            Visit organizer's website
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Status */}
                        {event.event_status &&
                            event.event_status !== "active" && (
                                <div className="bg-gray-50 rounded-xl p-6">
                                    <h3 className="text-xl font-semibold mb-4">
                                        Event Status
                                    </h3>
                                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-yellow-500/20 text-yellow-700">
                                        {event.event_status
                                            .charAt(0)
                                            .toUpperCase() +
                                            event.event_status.slice(1)}
                                    </span>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}
