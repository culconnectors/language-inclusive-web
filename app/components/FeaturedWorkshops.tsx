"use client";

import { useQuery } from "@tanstack/react-query";
import WorkshopCard from "./workshop/WorkshopCard";

/** Represents a workshop from the API */
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
    /** Workshop location coordinates */
    location: {
        latitude: number;
        longitude: number;
    };
}

/** API response structure for workshops */
interface ApiResponse {
    /** List of workshops */
    workshops: Workshop[];
    /** Pagination information */
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        hasMore: boolean;
    };
}

/** Featured workshops component that displays upcoming workshops in Melbourne */
export default function FeaturedWorkshops() {
    // Melbourne coordinates
    const melbourneCoords = {
        lat: -37.8136,
        lng: 144.9631,
    };

    const { data, isLoading } = useQuery({
        queryKey: ["featuredWorkshops", melbourneCoords],
        queryFn: async (): Promise<Workshop[]> => {
            const response = await fetch(
                `/api/workshops?lat=${melbourneCoords.lat}&lng=${melbourneCoords.lng}&radius=20`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch workshops");
            }
            const data: ApiResponse = await response.json();
            return data.workshops.slice(0, 4); // Only take the first 4 workshops
        },
    });

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
                    >
                        <div className="p-6 space-y-4">
                            <div className="h-6 bg-gray-200 rounded w-3/4" />
                            <div className="h-4 bg-gray-200 rounded w-1/2" />
                            <div className="h-4 bg-gray-200 rounded w-2/3" />
                            <div className="h-10 bg-gray-200 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="text-center text-gray-500 py-8">
                No workshops found in your area.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {data.map((workshop) => (
                <WorkshopCard key={workshop.id} workshop={workshop} />
            ))}
        </div>
    );
}
