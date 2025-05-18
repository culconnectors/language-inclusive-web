"use client";

import Navbar from "@/app/components/Navbar";
import PdfUploader from "./PdfUploader";

export default function CulConnectorsAIPage() {
    return (
        <main className="min-h-screen bg-gray-50">
            <Navbar />
            <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        CulConnectorsAI
                    </h1>
                    <div className="max-w-3xl mx-auto">
                        <p className="text-lg text-gray-600 text-center mb-8">
                            Have a document you don’t understand? Our AI will
                            help you understand it
                        </p>
                        <p className="text-lg text-gray-600 text-center mb-8">
                            Upload a PDF document to extract its text content
                        </p>
                        <PdfUploader />
                    </div>
                    <div className="max-w-3xl mx-auto mt-8">
                        <p className="text-lg text-gray-600 text-center mb-8">
                            If you need professional translation service, please
                            visit
                            <br className="my-2" />
                            <a
                                href="https://translating.homeaffairs.gov.au/en"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                Free Translating Service - Department of Home
                                Affairs
                            </a>
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
