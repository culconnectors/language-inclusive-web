/**
 * LGA English Proficiency API Route
 *
 * This module provides an API endpoint for fetching English language proficiency data
 * for a specific Local Government Area, including language levels and counts.
 *
 * @module app/api/lga/englishProficiency/route
 */

import { NextRequest, NextResponse } from "next/server";
import { lgaClient } from "@/lib/prisma";

/**
 * GET handler for the LGA English Proficiency API endpoint
 * Fetches language proficiency data for a specific LGA
 *
 * @param {NextRequest} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response containing language proficiency data
 *
 * @example
 * GET /api/lga/englishProficiency?lgaCode=12345
 *
 * @throws {Error} When LGA code is missing
 * @throws {Error} When LGA code format is invalid
 * @throws {Error} When database query fails
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const lgaCode = searchParams.get("lgaCode");

        if (!lgaCode) {
            return NextResponse.json(
                { error: "LGA code is required" },
                { status: 400 }
            );
        }

        // Convert lgaCode to integer and validate
        const lgaCodeInt = parseInt(lgaCode, 10);
        if (isNaN(lgaCodeInt)) {
            return NextResponse.json(
                { error: "Invalid LGA code format" },
                { status: 400 }
            );
        }

        const languageProficiencyData =
            await lgaClient.lgaLanguageProficiency.findMany({
                where: {
                    lga_code: lgaCodeInt,
                },
                select: {
                    language: {
                        select: {
                            language: true,
                        },
                    },
                    english_profiency_level: true,
                    count: true,
                },
                orderBy: {
                    count: "desc",
                },
            });

        // Return empty array if no data found
        if (languageProficiencyData.length === 0) {
            return NextResponse.json([]);
        }

        // Transform the data to match the expected format
        const formattedData = languageProficiencyData.map((item) => ({
            language: item.language.language || "Unknown",
            level: item.english_profiency_level,
            count: item.count,
        }));

        return NextResponse.json(formattedData);
    } catch (error) {
        console.error("Error fetching language proficiency data:", error);
        return NextResponse.json(
            { error: "Failed to fetch language proficiency data" },
            { status: 500 }
        );
    }
}
