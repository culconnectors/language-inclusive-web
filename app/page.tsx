"use client";
import Navbar from "@/app/components/Navbar";
import PopularServices from "@/app/components/PopularServices";
import EventSearch from "@/app/components/EventSearch";

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Language shouldn't be a barrier to opportunities
                    </h1>
                    <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
                        Connect with local support, jobs, events, and services
                        in your area
                    </p>

                    <EventSearch />
                </div>
            </section>

            <PopularServices />
        </main>
    );
}
