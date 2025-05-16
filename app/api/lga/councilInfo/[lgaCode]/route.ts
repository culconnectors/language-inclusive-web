import { NextRequest, NextResponse } from "next/server";
import { lgaClient } from "@/lib/prisma";

/**
 * GET handler for fetching council information for a specific LGA.
 *
 * @param {NextRequest} request - The incoming request object.
 * @returns {Promise<NextResponse>} JSON response with council info or error.
 *
 * - Extracts lgaCode from the URL path.
 * - Returns council info and related LGA data if found.
 * - Returns 400 for invalid code, 404 if not found, 500 for server error.
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
