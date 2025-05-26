/**
 * LGA Nationalities Data API Route
 *
 * This module provides an API endpoint for fetching nationality distribution data
 * for a specific Local Government Area, focusing on non-Australian nationalities.
 *
 * @module app/api/lga/nationalitiesData/route
 */

import { NextResponse } from "next/server";
import { lgaClient } from "@/lib/prisma";

/**
 * GET handler for the LGA Nationalities Data API endpoint
 * Fetches top 10 non-Australian nationalities for a specific LGA
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response containing nationality data
 *
 * @example
 * GET /api/lga/nationalitiesData?lgaCode=12345
 *
 * @throws {Error} When LGA code is missing
 * @throws {Error} When database query fails
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lgaCode = searchParams.get("lgaCode");

        if (!lgaCode) {
            return NextResponse.json(
                { error: "LGA code is required" },
                { status: 400 }
            );
        }

        const nationalityData = await lgaClient.lgaNationality.findMany({
            where: {
                lga_code: parseInt(lgaCode, 10),
                nationality: {
                    NOT: {
                        nationality: {
                            in: ["Australia", "New Zealand", "England"],
                        },
                    },
                },
            },
            select: {
                nationality: {
                    select: {
                        nationality: true,
                    },
                },
                count: true,
            },
            orderBy: {
                count: "desc",
            },
            take: 10,
        });

        // Transform the data to match the expected format
        const formattedData = nationalityData.map((item) => ({
            nationality: item.nationality.nationality,
            count: item.count,
        }));

        return NextResponse.json(formattedData);
    } catch (error) {
        console.error("Error fetching nationality data:", error);
        return NextResponse.json(
            { error: "Failed to fetch nationality data" },
            { status: 500 }
        );
    }
}
