"use client";

import Navbar from "@/app/components/Navbar";
import PdfUploader from "./PdfUploader";

export default function TranslationPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        Translation Services
                    </h1>
                    <div className="max-w-3xl mx-auto">
                        <p className="text-lg text-gray-600 text-center mb-8">
                            Upload a PDF document to extract its text content
                        </p>
                        <PdfUploader />
                    </div>
                </div>
            </section>
        </main>
    );
}
