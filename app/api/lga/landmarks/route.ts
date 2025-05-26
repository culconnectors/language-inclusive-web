/**
 * LGA Landmarks API Route
 *
 * This module provides an API endpoint for fetching landmark information
 * across all Local Government Areas, including their locations and descriptions.
 *
 * @module app/api/lga/landmarks/route
 */

import { NextResponse } from "next/server";
import { landmarkClient } from "@/lib/prisma";

/**
 * GET handler for the LGA Landmarks API endpoint
 * Fetches all landmarks with their details including name, location, description, and type
 *
 * @returns {Promise<NextResponse>} JSON response containing landmarks data
 *
 * @example
 * GET /api/lga/landmarks
 *
 * @throws {Error} When database query fails
 */
export async function GET() {
    try {
        const landmarks = await landmarkClient.landmark.findMany({
            select: {
                landmark_name: true,
                latitude: true,
                longitude: true,
                landmark_description: true,
                ilms_url: true,
                type: {
                    select: {
                        landmark_type: true,
                    },
                },
            },
        });

        return NextResponse.json(landmarks);
    } catch (error) {
        console.error("[GET /api/lga/landmarks] Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch landmarks" },
            { status: 500 }
        );
    }
}
