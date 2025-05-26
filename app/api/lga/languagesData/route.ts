/**
 * LGA Languages Data API Route
 *
 * This module provides an API endpoint for fetching language distribution data
 * for a specific Local Government Area, including language counts and rankings.
 *
 * @module app/api/lga/languagesData/route
 */

import { NextResponse } from "next/server";
import { lgaClient } from "@/lib/prisma";

/**
 * GET handler for the LGA Languages Data API endpoint
 * Fetches language distribution data for a specific LGA
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response containing language data
 *
 * @example
 * GET /api/lga/languagesData?lgaCode=12345
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

        const languageData = await lgaClient.lgaLanguageProficiency.findMany({
            where: {
                lga_code: parseInt(lgaCode, 10),
            },
            select: {
                language: true,
                count: true,
            },
            orderBy: {
                count: "desc",
            },
        });

        return NextResponse.json(languageData);
    } catch (error) {
        console.error("Error fetching language data:", error);
        return NextResponse.json(
            { error: "Failed to fetch language data" },
            { status: 500 }
        );
    }
}
