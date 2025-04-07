"use client";

import Navbar from "@/app/components/Navbar";
import PopularServices from "@/app/components/PopularServices";

export default function Events() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">
                        Community Events
                    </h1>
                    <p className="text-xl text-gray-600 mb-12">
                        Discover and participate in local events that celebrate
                        diversity and foster connections.
                    </p>
                </div>
            </div>
            <PopularServices />
        </main>
    );
}
