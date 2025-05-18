"use client";

import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* About Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">About Us</h3>
                        <p className="text-gray-400">
                            CulConnectors connect communities through language,
                            breaking down barriers and creating opportunities
                            for everyone.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/events"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Social Events
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/workshops"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Language Workshops
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/community"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    Community Explorer
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/culconnectorsai"
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    CulConnectorsAI
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">
                            Contact Us
                        </h3>
                        <ul className="space-y-2">
                            <li className="flex items-center text-gray-400">
                                <svg
                                    className="w-5 h-5 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                                <a
                                    href="mailto:culconnectors@gmail.com"
                                    className="hover:text-white transition-colors"
                                >
                                    culconnectors@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                    <p>
                        &copy; {new Date().getFullYear()} SocialConnect. All
                        rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
