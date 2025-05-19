"use client";

import Navbar from "@/app/components/Navbar";

export default function PrivacyPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <section className="relative flex items-center bg-[#0A0F1D] pt-16">
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 leading-tight">
                            <span className="relative inline-block">
                                Privacy
                                <span className="absolute bottom-1 -left-2 w-[calc(100%+1rem)] h-3 bg-[#FABB20] -z-10 transform -rotate-2"></span>
                            </span>
                            {" "}Policy
                        </h1>
                        <p className="text-xl text-white/80 mb-4">
                            How we protect and handle your information
                        </p>
                    </div>
                </div>

                {/* Yellow Wave Divider */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-[#FABB20]" style={{
                    clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)"
                }}></div>
            </section>

            <section className="bg-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-8">
                        <section>
                            <h2 className="text-2xl font-semibold mb-4">About This Policy</h2>
                            <p className="text-gray-700 leading-relaxed">
                                This Privacy Policy explains how CulConnectors ("we", "our", or "us") collects, uses, discloses and protects your personal information. We are bound by the Australian Privacy Principles (APPs) contained in the Privacy Act 1988 (Cth). This policy was last updated on {new Date().toLocaleDateString()}.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Personal Information We Collect</h2>
                            <div className="space-y-4">
                                <h3 className="text-xl font-medium">Types of Information</h3>
                                <p className="text-gray-700 mb-4">We collect and hold the following types of information:</p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li>Location data when you search for events or workshops</li>
                                    <li>Usage data about how you interact with our services</li>
                                    <li>Device information (such as browser type and IP address)</li>
                                    <li>Search preferences and event interests</li>
                                </ul>

                                <h3 className="text-xl font-medium mt-6">How We Collect Information</h3>
                                <p className="text-gray-700 mb-4">We collect information in the following ways:</p>
                                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                    <li>Automatically through your use of our website and services</li>
                                    <li>When you search for events or workshops</li>
                                    <li>Through your interaction with our platform</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
                            <p className="text-gray-700 mb-4">We use your information for the following purposes:</p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>To provide and improve our services</li>
                                <li>To show you relevant events and workshops based on your location</li>
                                <li>To enhance your browsing experience</li>
                                <li>To analyze usage patterns and improve our platform</li>
                                <li>To detect and prevent technical issues</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Disclosure of Your Information</h2>
                            <p className="text-gray-700 mb-4">We may share non-identifying information with:</p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>Service providers who assist in operating our platform</li>
                                <li>Analytics providers to help us improve our services</li>
                                <li>Law enforcement or government agencies where required by law</li>
                            </ul>
                            <p className="text-gray-700 mt-4">
                                We do not collect or store personal identifying information, and therefore do not sell or share personal information with third parties.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Anonymous Usage</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Our service is designed to be used anonymously. You can search for and view events and workshops without creating an account or providing any personal identifying information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Security of Your Information</h2>
                            <p className="text-gray-700 leading-relaxed">
                                While we do not collect personal identifying information, we still take reasonable steps to protect the information we do collect from misuse, interference, loss, unauthorized access, modification, or disclosure. These steps include:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-2">
                                <li>Using encryption for data transmission</li>
                                <li>Regular security assessments and updates</li>
                                <li>Implementing appropriate technical measures to protect our systems</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Your Rights and Choices</h2>
                            <p className="text-gray-700 mb-4">You have the right to:</p>
                            <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                <li>Use our services anonymously</li>
                                <li>Clear your browser data and cookies</li>
                                <li>Make a privacy complaint</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Access and Correction</h2>
                            <p className="text-gray-700 leading-relaxed">
                                You can access and update most of your personal information directly through your account settings. You may also request access to or correction of your personal information by contacting us. We will respond to your request within 30 days. If we deny your request, we will provide reasons for the denial.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Making a Complaint</h2>
                            <p className="text-gray-700 leading-relaxed">
                                If you have concerns about how we handle information, please contact us first at{" "}
                                <a href="mailto:culconnectors@gmail.com" className="text-blue-600 hover:underline">
                                    culconnectors@gmail.com
                                </a>
                                . We will investigate your complaint and respond within 30 days.
                            </p>
                            <p className="text-gray-700 mt-4">
                                If you are not satisfied with our response, you can complain to the Office of the Australian Information Commissioner (OAIC) at{" "}
                                <a href="https://www.oaic.gov.au" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                    www.oaic.gov.au
                                </a>
                                .
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
                            <p className="text-gray-700 leading-relaxed">
                                If you have any questions about this Privacy Policy or how we handle information, please contact us at:{" "}
                                <a href="mailto:culconnectors@gmail.com" className="text-blue-600 hover:underline">
                                    culconnectors@gmail.com
                                </a>
                            </p>
                        </section>

                        <section className="text-sm text-gray-500">
                            <p>Last updated: {new Date().toLocaleDateString()}</p>
                        </section>
                    </div>
                </div>
            </section>
        </main>
    );
} 