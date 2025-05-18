"use client";

import Navbar from "@/app/components/Navbar";
import PdfUploader from "./PdfUploader";
import { InfoIcon, AlertTriangle } from "lucide-react";

export default function CulConnectorsAIPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <section className="relative flex items-center bg-[#0A0F1D] pt-16">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                            CulConnectorsAI
                            <span className="relative inline-block ml-2">
                                Assistant
                                <span className="absolute bottom-1 -left-2 w-[calc(100%+1rem)] h-3 bg-[#FABB20] -z-10 transform -rotate-2"></span>
                            </span>
                        </h1>
                        <p className="text-xl text-white/80 mb-4">
                            Have a document you don't understand? Our AI will help you understand it
                        </p>
                    </div>
                </div>

                {/* Yellow Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#FABB20]" style={{
                    clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)"
                }}></div>
            </section>

            <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="max-w-3xl mx-auto">
                        <p className="text-lg text-gray-600 text-center mb-8">
                            Upload a PDF document to extract its text content
                        </p>
                        <PdfUploader />
                        <div className="mt-8 space-y-8">
                            <div className="bg-red-100 border border-blue-200 rounded-lg p-6">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-blue-900">This does not replace professional translations.</h4>
                                        <p className="text-blue-800/80 text-sm leading-relaxed">
                                            Visit the{" "}
                                            <a
                                                href="https://translating.homeaffairs.gov.au/en"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 underline font-medium"
                                            >
                                                Free Translating Service - Department of Home Affairs
                                            </a>
                                            {" "}for official document translations.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                <div className="flex items-start gap-3">
                                    <InfoIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-blue-900">Transparency Notice</h4>
                                        <p className="text-blue-800/80 text-sm leading-relaxed">
                                            Please note that any text or files you upload for translation will be processed using Google Gemini, an AI-powered language model developed by Google. This means your data will be sent to and temporarily handled by Google services to perform the translation. We do not store your files beyond what is necessary for processing, and we take your privacy seriously.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
