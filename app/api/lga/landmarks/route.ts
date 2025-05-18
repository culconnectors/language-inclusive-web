import { NextResponse } from "next/server";
import { landmarkClient } from "@/lib/prisma";

export async function GET() {
    try {
        const landmarks = await landmarkClient.landmark.findMany({
            select: {
                landmark_name: true,
                latitude: true,
                longitude: true,
                landmark_description: true,
                ilms_url: true,
                type: {
                    select: {
                        landmark_type: true,
                    },
                },
            },
        });

        return NextResponse.json(landmarks);
    } catch (error) {
        console.error("[GET /api/lga/landmarks] Error:", error);
        return NextResponse.json(
            { error: "Failed to fetch landmarks" },
            { status: 500 }
        );
    }
}
