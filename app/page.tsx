"use client";
import Navbar from "@/app/components/Navbar";
import LandingCarousel from "@/app/components/landingCarousel";
import { useTheme } from "@/app/hooks/useTheme";

export default function Home() {
    const { isDarkMode } = useTheme();

    return (
        <main
            className={`min-h-screen ${
                isDarkMode ? "bg-gray-900" : "bg-gray-50"
            }`}
        >
            <Navbar />
            <LandingCarousel />
        </main>
    );
}
