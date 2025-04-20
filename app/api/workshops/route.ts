import { NextResponse } from "next/server";
import { workshopClient } from "@/lib/prisma";

interface Workshop {
    id: string;
    name: string;
    provider_name: string;
    url: string;
    location: {
        latitude: number;
        longitude: number;
    };
}

type Location = {
    geographic_id: number;
    provider_id: number;
    latitude: number;
    longitude: number;
    address_line_1: string;
    suburb: string;
    postcode: number;
    full_address: string;
    region_name: string;
    local_government_authority: string;
};

type Provider = {
    provider_id: number;
    provider_name: string;
    site_name: string;
    government_subsidised: string;
    subsidy_tag: string | null;
    asqa_code: number;
    url: string | null;
    email: string | null;
    locations: Location[];
};

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = parseFloat(searchParams.get("lat") || "0");
        const lng = parseFloat(searchParams.get("lng") || "0");
        const radius = 20; // 20km radius

        // Using Prisma's query builder with relations, without English filtering
        const workshops = (await workshopClient.provider.findMany({
            include: {
                locations: true,
            },
        })) as Provider[];

        // Filter and format workshops based on distance, keeping only distinct provider names
        const formattedWorkshops: Workshop[] = [];
        const seenProviderNames = new Set<string>();

        workshops.forEach((provider) => {
            // Skip if we've already seen this provider name
            if (seenProviderNames.has(provider.provider_name)) {
                return;
            }

            // Find the closest location for this provider within radius
            let closestLocation: Location | null = null;
            let shortestDistance = Infinity;

            provider.locations.forEach((location) => {
                const distance = calculateDistance(
                    lat,
                    lng,
                    location.latitude,
                    location.longitude
                );

                if (distance <= radius && distance < shortestDistance) {
                    closestLocation = location;
                    shortestDistance = distance;
                }
            });

            // If we found a location within radius, add this provider
            if (closestLocation) {
                seenProviderNames.add(provider.provider_name);
                formattedWorkshops.push({
                    id: `${provider.provider_name}-${closestLocation.geographic_id}`,
                    name: provider.provider_name,
                    provider_name: provider.provider_name,
                    url: provider.url || "",
                    location: {
                        latitude: closestLocation.latitude,
                        longitude: closestLocation.longitude,
                    },
                });
            }
        });

        // Sort by distance
        formattedWorkshops.sort((a, b) => {
            const distanceA = calculateDistance(
                lat,
                lng,
                a.location.latitude,
                a.location.longitude
            );
            const distanceB = calculateDistance(
                lat,
                lng,
                b.location.latitude,
                b.location.longitude
            );
            return distanceA - distanceB;
        });

        return NextResponse.json(formattedWorkshops);
    } catch (error) {
        console.error("Error fetching workshops:", error);
        return NextResponse.json(
            { error: "Failed to fetch workshops" },
            { status: 500 }
        );
    }
}

// Function to calculate distance between two coordinates using Haversine formula
function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
