"use client";

import Image from "next/image";

/**
 * Represents a workshop with its details
 */
interface Workshop {
    /** Unique identifier for the workshop */
    id: string;
    /** Name of the workshop */
    name: string;
    /** Name of the workshop provider */
    provider_name: string;
    /** Workshop description */
    description: string;
    /** URL to the workshop page */
    url: string;
}

/**
 * Props for the WorkshopCard component
 */
interface WorkshopCardProps {
    /** Workshop data to display */
    workshop: Workshop;
}

/**
 * Workshop card component for displaying workshop information
 * Features:
 * - Workshop name display
 * - Provider name
 * - Description with line clamping
 * - External link to course
 * - Hover effects
 * - Shadow transitions
 */
export default function WorkshopCard({ workshop }: WorkshopCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {workshop.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                    {workshop.provider_name}
                </p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {workshop.description}
                </p>
                <a
                    href={workshop.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-[#FABB20] text-white py-2 px-4 rounded-md hover:bg-[#FABB20]/90 transition-colors duration-300"
                >
                    View Course
                </a>
            </div>
        </div>
    );
}
