/**
 * LGA Landmarks Destinations API Route
 *
 * This module provides an API endpoint for fetching destination information
 * across all Local Government Areas, including visitor statistics and images.
 *
 * @module app/api/lga/landmarks/destinations/route
 */

import { NextResponse } from "next/server";
import { landmarkClient } from "@/lib/prisma";

/**
 * GET handler for the LGA Landmarks Destinations API endpoint
 * Fetches destination information with visitor statistics and images
 *
 * @returns {Promise<NextResponse>} JSON response containing destinations data
 *
 * @example
 * GET /api/lga/landmarks/destinations
 *
 * @throws {Error} When database query fails
 */
export async function GET() {
    try {
        const destinations = await landmarkClient.destination.findMany({
            select: {
                destination_name: true,
                description: true,
                website: true,
                image_url: true,
                image_attribution: true,
                counts: {
                    select: {
                        total_stay_counts: true,
                        pct_change_yoy: true,
                    },
                },
            },
        });
        // Flatten counts if only one per destination, otherwise return as array
        const result = destinations.map((dest) => ({
            ...dest,
            total_stay_counts: dest.counts[0]?.total_stay_counts ?? null,
            pct_change_yoy: dest.counts[0]?.pct_change_yoy ?? null,
            counts: undefined,
        }));
        return NextResponse.json(result);
    } catch (error) {
        console.error("[GET /api/lga/landmarks/destinations] Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch destinations" },
            { status: 500 }
        );
    }
}
