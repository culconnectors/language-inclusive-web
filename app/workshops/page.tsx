"use client";

import Navbar from "@/app/components/Navbar";
import WorkshopSearch from "@/app/components/workshop/WorkshopSearch";

export default function Workshops() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Language Workshops
                        </h1>
                        <p className="text-xl text-gray-600">
                            Find and join language learning workshops in your
                            area
                        </p>
                    </div>
                    <WorkshopSearch />
                </div>
            </section>
        </main>
    );
}
