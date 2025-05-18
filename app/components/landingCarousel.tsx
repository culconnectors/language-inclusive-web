"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type ExplorationTypes = "events" | "workshops" | "community" | "translation";

const images = [
    {
        src: "https://images.unsplash.com/photo-1494236472818-d35e50e604cf?q=80&w=2072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "Man and girl walking beside building",
    },
    {
        src: "https://images.unsplash.com/photo-1729655918050-a9a048ec93e6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "A group of people standing in a room",
    },
    {
        src: "https://images.unsplash.com/photo-1635468073086-7edff555234a?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        alt: "A group of people sitting at a table working on a project",
    },
];

export default function LandingCarousel() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [activeType, setActiveType] = useState<ExplorationTypes>("events");
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === images.length - 1 ? 0 : prevIndex + 1
            );
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const handleTabClick = (type: ExplorationTypes) => {
        setActiveType(type);
        switch (type) {
            case "events":
                router.push("/events");
                break;
            case "workshops":
                router.push("/workshops");
                break;
            case "community":
                router.push("/community");
                break;
            case "translation":
                router.push("/translation");
                break;
        }
    };

    return (
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center mt-16">
            <div className="w-full">
                {/* Hero Content with Background */}
                <div className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8">
                    {/* Background Carousel */}
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        {images.map((image, index) => (
                            <div
                                key={image.src}
                                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                                    index === currentImageIndex
                                        ? "opacity-100"
                                        : "opacity-0"
                                }`}
                            >
                                <div className="flex justify-center items-center h-full w-full">
                                    <Image
                                        src={image.src}
                                        alt={image.alt}
                                        width={1280}
                                        height={720}
                                        className="object-cover max-w-full max-h-[90vh] rounded-xl shadow-xl"
                                        priority={index === 0}
                                        quality={90}
                                    />
                                </div>
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                            </div>
                        ))}
                    </div>

                    {/* Content Section */}
                    <div className="relative z-20 py-20 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-6xl mx-auto text-center">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg mb-6">
                                Your Language
                                <br /> shouldn't be a barrier to opportunities
                            </h1>
                            <p className="text-xl text-white/90 mb-12 max-w-3xl mx-auto drop-shadow">
                                Connect with local support, jobs, events, and
                                services in your area
                            </p>

                            {/* Exploration Toggle */}
                            <div className="w-full max-w-3xl mx-auto space-y-6">
                                <div className="flex justify-center gap-4 flex-wrap">
                                    {[
                                        {
                                            label: "Social Events",
                                            key: "events",
                                        },
                                        {
                                            label: "Language Workshops",
                                            key: "workshops",
                                        },
                                        {
                                            label: "Community Explorer",
                                            key: "community",
                                        },
                                        {
                                            label: "Translation",
                                            key: "translation",
                                        },
                                    ].map(({ label, key }) => (
                                        <button
                                            key={key}
                                            onClick={() =>
                                                handleTabClick(
                                                    key as ExplorationTypes
                                                )
                                            }
                                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 backdrop-blur-md shadow-lg ${
                                                activeType === key
                                                    ? "bg-primary text-white scale-105"
                                                    : "bg-white/80 text-zinc-800 hover:bg-white/90"
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
