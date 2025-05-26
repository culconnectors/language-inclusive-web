/**
 * LGA Statistics API Route
 *
 * This module provides an API endpoint for fetching detailed demographic statistics
 * for a specific Local Government Area, including education, employment, and population data.
 *
 * @module app/api/lga/statistics/[lgaCode]/route
 */

import { NextRequest, NextResponse } from "next/server";
import { lgaClient } from "@/lib/prisma";

/**
 * GET handler for the LGA Statistics API endpoint
 * Fetches detailed demographic statistics for a specific LGA
 *
 * @param {NextRequest} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response containing formatted statistics
 *
 * @example
 * GET /api/lga/statistics/12345
 *
 * @throws {Error} When LGA code is invalid
 * @throws {Error} When statistics are not found
 * @throws {Error} When database query fails
 */
export async function GET(request: NextRequest) {
    try {
        // Extract lgaCode from the URL path
        const url = new URL(request.url);
        const lgaCode = parseInt(url.pathname.split("/").pop() || "");

        if (isNaN(lgaCode)) {
            return NextResponse.json(
                { error: "Invalid LGA code" },
                { status: 400 }
            );
        }

        const statistics = await lgaClient.lgaStatistics.findUnique({
            where: {
                lga_code: lgaCode,
            },
            include: {
                lga: true, // Include related LGA data
            },
        });

        if (!statistics) {
            return NextResponse.json(
                { error: "No statistics found for that LGA code" },
                { status: 404 }
            );
        }

        // Transform percentage values to be more readable
        const formattedStatistics = {
            ...statistics,
            pct_arrived_within_5_years:
                statistics.pct_arrived_within_5_years?.toFixed(1),
            pct_proficient_english:
                statistics.pct_proficient_english?.toFixed(1),
            pct_speaks_other_lang_at_home:
                statistics.pct_speaks_other_lang_at_home?.toFixed(1),
            median_age_years: statistics.median_age_years?.toFixed(1),
            pct_completed_year_12: statistics.pct_completed_year_12?.toFixed(1),
            pct_certificate: statistics.pct_certificate?.toFixed(1),
            pct_bachelor_degree: statistics.pct_bachelor_degree?.toFixed(1),
            pct_postgraduate: statistics.pct_postgraduate?.toFixed(1),
            pct_managers: statistics.pct_managers?.toFixed(1),
            pct_professionals: statistics.pct_professionals?.toFixed(1),
            pct_labourers: statistics.pct_labourers?.toFixed(1),
        };

        return NextResponse.json(formattedStatistics);
    } catch (error) {
        console.error("Statistics lookup failed:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
