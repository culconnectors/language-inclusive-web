/**
 * LGA Council Info API Route
 *
 * This module provides an API endpoint for fetching detailed council information
 * for a specific Local Government Area, including related LGA data.
 *
 * @module app/api/lga/councilInfo/[lgaCode]/route
 */

import { NextRequest, NextResponse } from "next/server";
import { lgaClient } from "@/lib/prisma";

/**
 * GET handler for the LGA Council Info API endpoint
 * Fetches council information for a specific LGA code
 *
 * @param {NextRequest} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response containing council information
 *
 * @example
 * GET /api/lga/councilInfo/12345
 *
 * @throws {Error} When LGA code is invalid
 * @throws {Error} When council information is not found
 * @throws {Error} When database query fails
 */
export async function GET(request: NextRequest) {
    try {
        // Get lgaCode from URL pattern
        const url = new URL(request.url);
        const lgaCode = parseInt(url.pathname.split("/").pop() || "");

        if (isNaN(lgaCode)) {
            return NextResponse.json(
                { error: "Invalid LGA code" },
                { status: 400 }
            );
        }

        // Fetch council info using Prisma
        const councilInfo = await lgaClient.councilInfo.findUnique({
            where: {
                lga_code: lgaCode,
            },
            include: {
                lga: true, // Include related LGA data
            },
        });

        if (!councilInfo) {
            return NextResponse.json(
                { error: "No council information found for that LGA code" },
                { status: 404 }
            );
        }

        return NextResponse.json(councilInfo);
    } catch (error) {
        console.error("Council info lookup failed:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
