"use client";
import Navbar from "@/app/components/Navbar";
import LandingCarousel from "@/app/components/landingCarousel";

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <LandingCarousel />
        </main>
    );
}
