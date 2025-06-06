"use client";

import Navbar from "@/app/components/Navbar";
import EventSearch from "@/app/components/event/DataEventSearch";

/**
 * Events page component
 * Features:
 * - Displays a hero section for social events
 * - Integrates the event search component for location-based event discovery
 * - Responsive design with navigation
 *
 * @returns {JSX.Element} The rendered events page
 */
export default function Events() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <section className="relative flex items-center bg-[#0A0F1D] pt-16">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                            Social Events
                            <span className="relative inline-block ml-2">
                                Near You
                                <span className="absolute bottom-1 -left-2 w-[calc(100%+1rem)] h-3 bg-[#FABB20] -z-10 transform -rotate-2"></span>
                            </span>
                        </h1>
                        <p className="text-xl text-white/80 mb-4">
                            Discover and join social events in your community
                        </p>
                    </div>
                </div>

                {/* Yellow Wave Divider */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-12 bg-[#FABB20]"
                    style={{
                        clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)",
                    }}
                ></div>
            </section>

            <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <EventSearch />
                </div>
            </section>
        </main>
    );
}
