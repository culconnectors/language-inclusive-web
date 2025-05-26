/**
 * Workshops API Route
 *
 * This module provides an API endpoint for fetching language workshops and courses.
 * It supports location-based filtering and distance calculations for finding nearby workshops.
 *
 * @module app/api/workshops/route
 */

import { NextResponse } from "next/server";
import { workshopClient } from "@/lib/prisma";

/**
 * Interface representing a workshop with its details
 * @interface Workshop
 */
interface Workshop {
    id: string;
    name: string;
    provider_name: string;
    description: string;
    url: string;
    location: {
        latitude: number;
        longitude: number;
    };
}

/**
 * Calculates the distance between two geographic coordinates using the Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * GET handler for the Workshops API endpoint
 * Fetches English language workshops and courses based on location and radius parameters
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response containing workshops and total count
 *
 * @example
 * GET /api/workshops?lat=-33.8688&lng=151.2093&radius=20
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = parseFloat(searchParams.get("lat") || "0");
        const lng = parseFloat(searchParams.get("lng") || "0");
        const radius = parseFloat(searchParams.get("radius") || "20"); // Get radius from query params, default to 20km

        // Using Prisma's query builder with relations
        const providers = await workshopClient.provider.findMany({
            where: {
                courses: {
                    some: {
                        OR: [
                            { qualification_level: { contains: "English" } },
                            { course_title: { contains: "English" } },
                            { course_code: { contains: "ENG" } },
                        ],
                    },
                },
            },
            include: {
                locations: true,
                courses: {
                    where: {
                        OR: [
                            { qualification_level: { contains: "English" } },
                            { course_title: { contains: "English" } },
                            { course_code: { contains: "ENG" } },
                        ],
                    },
                },
            },
        });

        // Filter and format workshops based on distance
        const formattedWorkshops: Workshop[] = [];

        providers.forEach((provider) => {
            provider.locations.forEach((location) => {
                const distance = calculateDistance(
                    lat,
                    lng,
                    location.latitude,
                    location.longitude
                );

                if (distance <= radius) {
                    provider.courses.forEach((course) => {
                        formattedWorkshops.push({
                            id: `${provider.provider_id}${location.geographic_id}${course.course_id}`,
                            name: course.course_title,
                            provider_name: provider.provider_name,
                            description: course.description,
                            url: provider.url || "",
                            location: {
                                latitude: location.latitude,
                                longitude: location.longitude,
                            },
                        });
                    });
                }
            });
        });

        // Sort by distance
        const sortedWorkshops = formattedWorkshops.sort((a, b) => {
            const distanceA = calculateDistance(
                lat,
                lng,
                a.location.latitude,
                a.location.longitude
            );
            const distanceB = calculateDistance(
                lat,
                lng,
                b.location.latitude,
                b.location.longitude
            );
            return distanceA - distanceB;
        });

        return NextResponse.json({
            workshops: sortedWorkshops,
            totalItems: sortedWorkshops.length,
        });
    } catch (error) {
        console.error("Error fetching workshops:", error);
        return NextResponse.json(
            { error: "Failed to fetch workshops" },
            { status: 500 }
        );
    }
}
