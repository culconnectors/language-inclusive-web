/**
 * Google Place API Route
 *
 * This module provides an API endpoint for fetching place predictions from Google Places API.
 * It supports location autocomplete functionality for Australian addresses.
 *
 * @module app/api/googlePlace/route
 */

import { NextResponse } from "next/server";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const PLACES_API_URL =
    "https://maps.googleapis.com/maps/api/place/autocomplete/json";

/**
 * GET handler for the Google Place API endpoint
 * Fetches place predictions based on user input for Australian addresses
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response containing place predictions
 *
 * @example
 * GET /api/googlePlace?input=Sydney
 *
 * @throws {Error} When Google Maps API key is missing
 * @throws {Error} When Places API request fails
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const input = searchParams.get("input");

        if (!input) {
            return NextResponse.json(
                { error: "Input parameter is required" },
                { status: 400 }
            );
        }

        if (!GOOGLE_MAPS_API_KEY) {
            console.error("Google Maps API key is missing");
            return NextResponse.json(
                { error: "Google Maps API key is not configured" },
                { status: 500 }
            );
        }

        const response = await fetch(
            `${PLACES_API_URL}?input=${encodeURIComponent(
                input
            )}&components=country:au&types=geocode&key=${GOOGLE_MAPS_API_KEY}`
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Places API error:", errorData);
            throw new Error("Failed to fetch place predictions");
        }

        const data = await response.json();
        console.log("Places API response:", data);

        // Return the full prediction objects
        const predictions = data.predictions.map((prediction: any) => ({
            description: prediction.description,
            place_id: prediction.place_id,
        }));

        return NextResponse.json({ predictions });
    } catch (error) {
        console.error("Error fetching place predictions:", error);
        return NextResponse.json(
            { error: "Failed to fetch place predictions" },
            { status: 500 }
        );
    }
}
