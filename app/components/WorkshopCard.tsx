"use client";

import Image from "next/image";

interface Workshop {
    id: string;
    name: string;
    provider_name: string;
    url: string;
    logo?: {
        url: string;
    };
}

interface WorkshopCardProps {
    workshop: Workshop;
}

export default function WorkshopCard({ workshop }: WorkshopCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48 w-full">
                {workshop.logo?.url ? (
                    <Image
                        src={workshop.logo.url}
                        alt={workshop.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {workshop.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-1">
                    {workshop.provider_name}
                </p>
                <a
                    href={workshop.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                >
                    View Workshop
                </a>
            </div>
        </div>
    );
}
