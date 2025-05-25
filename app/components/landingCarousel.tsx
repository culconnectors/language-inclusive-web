"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import FeaturedWorkshops from "./FeaturedWorkshops";
import FeaturedEvents from "./FeaturedEvents";
import LanguageCycle from "./LanguageCycle";
import VideoPopup from "./VideoPopup";

// Language-specific hero images
const heroImages = {
    en: "/images/languages/en.jpg",    // English community
    es: "/images/languages/es.jpg",    // Spanish community
    zh: "/images/languages/zh.jpg",    // Chinese community
    fr: "/images/languages/fr.jpg",    // French community
    vi: "/images/languages/vi.jpg",    // Vietnamese community
    id: "/images/languages/id.jpg",    // Indonesian community
    hi: "/images/languages/hi.jpg",    // Hindi community
    ja: "/images/languages/ja.jpg",    // Japanese community
};

const languageOrder = ['en', 'es', 'zh', 'fr', 'vi', 'id', 'hi', 'ja'];

export default function LandingHero() {
    const router = useRouter();
    const [isVideoOpen, setIsVideoOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    // Calculate visible languages
    const visibleLanguages = useMemo(() => {
        return [-1, 0, 1, 2].map(offset => {
            const index = (currentIndex + offset + languageOrder.length) % languageOrder.length;
            return languageOrder[index];
        });
    }, [currentIndex]);

    const handleLanguageChange = (newLang: string) => {
        if (isAnimating) return;
        
        const newIndex = languageOrder.indexOf(newLang);
        if (newIndex === currentIndex) return;

        setIsAnimating(true);
        setCurrentIndex(newIndex);
        
        setTimeout(() => {
            setIsAnimating(false);
        }, 600);
    };

    return (
        <>
            <section className="relative min-h-screen flex flex-col justify-center bg-[#0A0F1D] overflow-hidden">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    {/* Text Content */}
                    <div className="relative z-10 mb-12 md:mb-20 max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                            <LanguageCycle 
                                onLanguageChange={handleLanguageChange}
                            /> shouldn't
                            <br /> be a barrier to{" "}
                            <span className="relative inline-block">
                                opportunity
                                <span className="absolute bottom-1 -left-2 w-[calc(100%+1rem)] h-3 bg-[#FABB20] -z-10 transform -rotate-2"></span>
                            </span>
                        </h1>
                        
                        <p className="text-lg text-white/80 mb-8">
                            Let us connect you to nearby Social Events and Workshops.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <button 
                                onClick={() => router.push('/events')}
                                className="px-6 py-3 bg-[#1A1F2D] text-white font-semibold rounded-full hover:bg-[#272B3A] transition-colors flex items-center gap-2 group"
                            >
                                Let's get started 
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                            <button 
                                onClick={() => setIsVideoOpen(true)}
                                className="px-6 py-3 bg-white text-[#1A1F2D] font-semibold rounded-full hover:bg-gray-100 transition-colors flex items-center gap-2"
                            >
                                How does it work?
                            </button>
                        </div>
                    </div>

                    {/* Image Carousel */}
                    <div className="relative mx-auto overflow-hidden">
                        <div className="relative w-[150%] -ml-[25%]">
                            <div 
                                className="flex gap-4 will-change-transform"
                                style={{
                                    transform: `translateX(calc(${-currentIndex * 34.666}% + 34.666%))`,
                                    transition: 'transform 600ms cubic-bezier(0.4, 0, 0.2, 1)'
                                }}
                            >
                                {languageOrder.map((lang, index) => {
                                    const isCurrent = index === currentIndex;
                                    return (
                                        <div 
                                            key={lang}
                                            className="w-[33.333%] shrink-0 will-change-transform"
                                            style={{
                                                transform: `scale(${isCurrent ? 1 : 0.95})`,
                                                opacity: isCurrent ? 1 : 0.3,
                                                transition: `
                                                    transform 600ms cubic-bezier(0.4, 0, 0.2, 1),
                                                    opacity 600ms cubic-bezier(0.4, 0, 0.2, 1)
                                                `,
                                                zIndex: isCurrent ? 1 : 0
                                            }}
                                        >
                                            <div className={`rounded-2xl overflow-hidden shadow-2xl ${isCurrent ? 'ring-4 ring-[#FABB20]' : ''}`}>
                                                <Image
                                                    src={heroImages[lang as keyof typeof heroImages]}
                                                    alt={isCurrent ? "Current cultural connection" : "Adjacent cultural connection"}
                                                    width={1200}
                                                    height={750}
                                                    className="object-cover w-full aspect-[16/10]"
                                                    priority
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Yellow Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#FABB20]" style={{
                    clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)"
                }}></div>
            </section>

            {/* Event Sources Section */}
            <section className="py-16 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-gray-600 mb-12">
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
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Featured Events
                    </h2>
                    <FeaturedEvents />
                </div>
            </section>

            {/* Featured Workshops Section */}
            <section className="bg-gray-50 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center mb-12">
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
