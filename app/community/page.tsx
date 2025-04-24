"use client";

import { useState } from 'react';
import Navbar from "@/app/components/Navbar";
import LgaMap from "@/app/components/map/LgaMap";

export default function CommunityPage() {
    const [selectedStatistic, setSelectedStatistic] = useState<string>();

    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
                        Community Explorer
                    </h1>
                    <p className="text-lg text-gray-600 text-center mb-8">
                        Explore Victorian Local Government Areas and their demographics
                    </p>
                    <div className="mb-8">
                        <LgaMap onSuburbSelect={handleLgaClick}/>
                    </div>
                </div>
            </section>
        </main>
    );
}
