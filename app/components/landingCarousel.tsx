"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FeaturedWorkshops from "./FeaturedWorkshops";
import FeaturedEvents from "./FeaturedEvents";
import LanguageCycle from "./LanguageCycle";
import VideoPopup from "./VideoPopup";
import { useTheme } from "@/app/hooks/useTheme";

export default function LandingHero() {
    const router = useRouter();
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const { isDarkMode } = useTheme();

    return (
        <>
            <section className="relative min-h-[80vh] flex items-center bg-[#0A0F1D]">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Column - Text Content */}
                        <div className="relative z-10">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                                <LanguageCycle /> shouldn't
                                <br /> be a barrier to{" "}
                                <span className="relative inline-block">
                                    opportunity
                                    <span className="absolute bottom-1 -left-2 w-[calc(100%+1rem)] h-3 bg-[#FABB20] -z-10 transform -rotate-2"></span>
                                </span>
                            </h1>

                            <p className="text-lg text-white/80 mb-8">
                                Let us connect you to nearby Social Events and
                                Workshops.
                            </p>

                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={() => router.push("/events")}
                                    className="px-6 py-3 bg-[#1A1F2D] text-white font-semibold rounded-full hover:bg-[#272B3A] transition-colors flex items-center gap-2 group"
                                >
                                    Let's get started
                                    <span className="group-hover:translate-x-1 transition-transform">
                                        →
                                    </span>
                                </button>
                                <button
                                    onClick={() => setIsVideoOpen(true)}
                                    className="px-6 py-3 bg-white text-[#1A1F2D] font-semibold rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2"
                                >
                                    How does it work?
                                </button>
                            </div>
                        </div>

                        {/* Right Column - Image */}
                        <div className="relative">
                            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1484688493527-670f98f9b195?q=80&w=2000&auto=format&fit=crop"
                                    alt="Diverse group of multicultural people smiling and interacting"
                                    width={600}
                                    height={400}
                                    className="object-cover w-full h-full"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Yellow Wave Divider */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-16 bg-[#FABB20]"
                    style={{
                        clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)",
                    }}
                ></div>
            </section>

            {/* Event Sources Section */}
            <section
                className={`py-16 ${
                    isDarkMode ? "bg-gray-900" : "bg-gray-50"
                } border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p
                        className={`text-center ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                        } mb-12`}
                    >
                        We're source various social events and workshops from:
                    </p>
                    <div className="flex justify-center items-center gap-20">
                        <div className="w-48">
                            <Image
                                src="/eventbrite.png"
                                alt="Eventbrite"
                                width={200}
                                height={60}
                                className="w-full h-auto"
                            />
                        </div>
                        <div className="w-48">
                            <Image
                                src="/ames.png"
                                alt="AMES Australia"
                                width={200}
                                height={60}
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Events Section */}
            <section
                className={`${
                    isDarkMode ? "bg-gray-900" : "bg-gray-50"
                } py-20 border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2
                        className={`text-3xl font-bold text-center mb-12 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                    >
                        Featured Events
                    </h2>
                    <FeaturedEvents />
                </div>
            </section>

            {/* Featured Workshops Section */}
            <section
                className={`${isDarkMode ? "bg-gray-900" : "bg-gray-50"} py-20`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2
                        className={`text-3xl font-bold text-center mb-12 ${
                            isDarkMode ? "text-white" : "text-gray-900"
                        }`}
                    >
                        Featured Workshops
                    </h2>
                    <FeaturedWorkshops />
                </div>
            </section>

            {/* Video Popup */}
            <VideoPopup
                isOpen={isVideoOpen}
                onClose={() => setIsVideoOpen(false)}
            />
        </>
    );
}
