/**
 * Google Place Details API Route
 *
 * This module provides an API endpoint for fetching detailed place information
 * from Google Places API, including geometry and address components.
 *
 * @module app/api/googlePlace/details/route
 */

import { NextResponse } from "next/server";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const PLACES_DETAILS_API_URL =
    "https://maps.googleapis.com/maps/api/place/details/json";

/**
 * GET handler for the Google Place Details API endpoint
 * Fetches detailed place information including location and postcode
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response containing place details
 *
 * @example
 * GET /api/googlePlace/details?placeId=ChIJ2XpWn9GtEmsRcKqFKhEQDZU
 *
 * @throws {Error} When Google Maps API key is missing
 * @throws {Error} When Places API request fails
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const placeId = searchParams.get("placeId");

        if (!placeId) {
            return NextResponse.json(
                { error: "Place ID is required" },
                { status: 400 }
            );
        }

        if (!GOOGLE_MAPS_API_KEY) {
            return NextResponse.json(
                { error: "Google Maps API key is not configured" },
                { status: 500 }
            );
        }

        const response = await fetch(
            `${PLACES_DETAILS_API_URL}?place_id=${placeId}&fields=geometry,address_component&key=${GOOGLE_MAPS_API_KEY}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch place details");
        }

        const data = await response.json();

        const components = data.result?.address_components || [];

        const postcodeComponent = components.find((c: any) =>
            c.types.includes("postal_code")
        );

        const postcode = postcodeComponent?.long_name || null;

        return NextResponse.json({
            location: data.result.geometry.location,
            postcode: postcode,
        });
    } catch (error) {
        console.error("Error fetching place details:", error);
        return NextResponse.json(
            { error: "Failed to fetch place details" },
            { status: 500 }
        );
    }
}
