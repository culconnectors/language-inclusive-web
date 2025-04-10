import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client-workshop";

const prisma = new PrismaClient();

interface RawWorkshopResult {
    provider_id: number;
    provider_name: string;
    url: string;
    latitude: number;
    longitude: number;
    email: string;
    full_address: string;
    geographic_id: string;
    region_name: string;
    course_id: number;
    course_title: string;
    course_code: string;
    qualification_level: string;
    entry_requirements: string;
    description: string;
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

        // Using raw SQL query with Prisma to match the provided SQL structure
        const workshops = await prisma.$queryRaw<RawWorkshopResult[]>`
      WITH workshops_with_distance AS (
        SELECT 
          p.provider_id,
          p.provider_name,
          p.url,
          l.latitude,
          l.longitude,
          p.email,
          l.full_address,
          l.geographic_id,
          l.region_name,
          c.course_id,
          c.course_title,
          c.course_code,
          c.qualification_level,
          c.entry_requirements,
          c.description,
          (
            6371 * acos(
              cos(radians(${lat})) * cos(radians(l.latitude)) *
              cos(radians(l.longitude) - radians(${lng})) +
              sin(radians(${lat})) * sin(radians(l.latitude))
            )
          ) as distance
        FROM "english_courses"."Provider" AS p
        JOIN "english_courses"."Location" AS l ON p.provider_id = l.provider_id
        JOIN "english_courses"."Course" AS c ON p.provider_id = c.provider_id
        WHERE c.qualification_level LIKE '%English%'
          OR c.course_title LIKE '%English%'
          OR c.course_code LIKE '%ENG%'
      )
      SELECT *
      FROM workshops_with_distance
      WHERE distance <= ${radius}
      ORDER BY distance;
    `;

        // Transform the raw SQL results to match the Workshop interface
        const formattedWorkshops = workshops.map(
            (workshop: RawWorkshopResult) => ({
                id:
                    workshop.provider_id.toString() +
                    workshop.geographic_id.toString() +
                    workshop.course_id.toString(),
                name: workshop.course_title,
                provider_name: workshop.provider_name,
                url: workshop.url || "",
                // Note: No logo in the database, so we'll leave it undefined
            })
        );

        return NextResponse.json(formattedWorkshops);
    } catch (error) {
        console.error("Error fetching workshops:", error);
        return NextResponse.json(
            { error: "Failed to fetch workshops" },
            { status: 500 }
        );
    }
}
