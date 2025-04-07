"use client";

import Navbar from "@/app/components/Navbar";
import PopularServices from "@/app/components/PopularServices";

export default function Translation() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="pt-32 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-gray-900 mb-8">
                        Translation Services
                    </h1>
                    <p className="text-xl text-gray-600 mb-12">
                        Connect with certified translators who understand your
                        needs and help bridge the language gap.
                    </p>
                </div>
            </div>
            <PopularServices />
        </main>
    );
}
