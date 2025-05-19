"use client";

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import LgaMap from "@/app/components/map/LgaMap";
import { useTheme } from "@/app/hooks/useTheme";

export default function CommunityPage() {
    const [selectedStatistic, setSelectedStatistic] = useState<string>();
    const [selectedLga, setSelectedLga] = useState<string>();
    const { isDarkMode } = useTheme();

    const handleLgaSelect = (lgaCode: string) => {
        setSelectedLga(lgaCode);
        console.log("Selected LGA:", lgaCode);
    };

    return (
        <main
            className={`min-h-screen ${
                isDarkMode ? "bg-gray-900" : "bg-white"
            }`}
        >
            <Navbar />
            <section className="relative flex items-center bg-[#0A0F1D] pt-16">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                            Community Explorer
                            <span className="relative inline-block ml-2">
                                Map
                                <span className="absolute bottom-1 -left-2 w-[calc(100%+1rem)] h-3 bg-[#FABB20] -z-10 transform -rotate-2"></span>
                            </span>
                        </h1>
                        <p className="text-xl text-white/80 mb-4">
                            Explore Victorian Local Government Areas and their
                            demographics
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

            <section
                className={`${
                    isDarkMode ? "bg-gray-900" : "bg-white"
                } py-12 px-4 sm:px-6 lg:px-8`}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <LgaMap onLgaSelect={handleLgaSelect} />
                    </div>
                </div>
            </section>
        </main>
    );
}
