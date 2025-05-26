/**
 * LGA Statistics Data API Route
 *
 * This module provides an API endpoint for fetching specific statistical data
 * across all Local Government Areas, supporting various demographic metrics.
 *
 * @module app/api/lga/statisticData/route
 */

/**
 * This route is used to fetch the statistic data for the LGA map
 * curl "http://localhost:3000/api/lga/statisticData?stat=born_overseas" | jq
 */
import { NextResponse } from "next/server";
import { lgaClient } from "@/lib/prisma";

/**
 * GET handler for the LGA Statistics Data API endpoint
 * Fetches a specific statistic for all LGAs
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response containing statistics data
 *
 * @example
 * GET /api/lga/statisticData?stat=born_overseas
 *
 * @throws {Error} When statistic key is missing
 * @throws {Error} When database query fails
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const stat = searchParams.get("stat");

        if (!stat) {
            return NextResponse.json(
                { error: "Statistic key is required" },
                { status: 400 }
            );
        }

        const stats = await lgaClient.lgaStatistics.findMany({
            select: {
                lga_code: true,
                [stat]: true,
            },
        });

        // Transform the data into the required format with LGA code and value
        const formattedStats = stats.map((statistic) => ({
            lga_code: String(statistic.lga_code),
            value: statistic[stat as keyof typeof statistic],
        }));

        return NextResponse.json(formattedStats);
    } catch (error) {
        console.error("Error fetching statistics:", error);
        return NextResponse.json(
            { error: "Failed to fetch statistics" },
            { status: 500 }
        );
    }
}
