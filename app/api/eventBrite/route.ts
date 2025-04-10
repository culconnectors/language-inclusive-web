import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RawEventResult {
    event_id: string;
    event_name: string;
    event_description: string;
    start_datetime: Date;
    end_datetime: Date;
    event_url: string | null;
    organizer_name: string;
    logo_url: string | null;
    category_name: string;
    venue_latitude: number;
    venue_longitude: number;
    venue_name: string;
    venue_address: string;
    venue_city: string;
    distance: number;
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

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = parseFloat(searchParams.get("lat") || "0");
        const lng = parseFloat(searchParams.get("lng") || "0");
        const radius = 20; // 20km radius

        // Using raw SQL query with Prisma
        const events = await prisma.$queryRaw<RawEventResult[]>`
      WITH events_with_distance AS (
        SELECT 
          e.event_id,
          e.event_name,
          e.event_description,
          e.start_datetime,
          e.end_datetime,
          e.event_url,
          o.organizer_name,
          l.logo_url,
          c.category_name,
          v.venue_latitude,
          v.venue_longitude,
          v.venue_name,
          v.venue_address,
          v.venue_city,
          (
            6371 * acos(
              cos(radians(${lat})) * cos(radians(v.venue_latitude)) *
              cos(radians(v.venue_longitude) - radians(${lng})) +
              sin(radians(${lat})) * sin(radians(v.venue_latitude))
            )
          ) as distance
        FROM "community_events"."Event" AS e
        JOIN "community_events"."Category" c ON e.category_id = c.category_id
        JOIN "community_events"."Venue" v ON e.venue_id = v.venue_id
        JOIN "community_events"."Organizer" o ON e.organizer_id = o.organizer_id
        LEFT JOIN "community_events"."Logo" l ON e.logo_id = l.logo_id
        WHERE e.event_status = 'live'
      )
      SELECT *
      FROM events_with_distance
      WHERE distance <= ${radius}
      ORDER BY distance;
    `;

        // Transform the raw SQL results to match the Event interface
        const formattedEvents = events.map((event) => ({
            id: event.event_id,
            name: event.event_name,
            description: event.event_description,
            url: event.event_url || "",
            start: {
                local: event.start_datetime.toISOString(),
            },
            end: {
                local: event.end_datetime.toISOString(),
            },
            venue: {
                name: event.venue_name,
                address: {
                    localized_address_display: `${event.venue_address}, ${event.venue_city}`,
                },
            },
            logo: event.logo_url
                ? {
                      url: event.logo_url,
                  }
                : undefined,
        }));

        return NextResponse.json(formattedEvents);
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(
            { error: "Failed to fetch events" },
            { status: 500 }
        );
    }
}
