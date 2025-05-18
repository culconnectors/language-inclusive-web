"use client";

import Navbar from "@/app/components/Navbar";
import EventSearch from "@/app/components/event/DataEventSearch";

export default function Events() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Social Events
                        </h1>
                        <p className="text-xl text-gray-600">
                            Discover and join social events in your community
                        </p>
                    </div>
                    <EventSearch />
                </div>
            </section>
        </main>
    );
}
