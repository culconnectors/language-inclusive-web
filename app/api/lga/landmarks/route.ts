import { NextResponse } from 'next/server';
import { landmarkClient } from '@/lib/prisma';

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
            landmark_type: true
          }
        }
      }
    });

    return NextResponse.json(landmarks);
  } catch (error) {
    console.error('[GET /api/lga/landmarks] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch landmarks' }, { status: 500 });
  }
}

// GET /api/lga/landmarks/destinations
export async function GET_destinations() {
  try {
    const destinations = await landmarkClient.destination.findMany({
      select: {
        destination_name: true,
        description: true,
        website: true,
        image_url: true,
        image_attribution: true,
        counts: {
          select: {
            total_stay_counts: true,
            pct_change_yoy: true
          }
        }
      }
    });
    // Flatten counts if only one per destination, otherwise return as array
    const result = destinations.map(dest => ({
      ...dest,
      total_stay_counts: dest.counts[0]?.total_stay_counts ?? null,
      pct_change_yoy: dest.counts[0]?.pct_change_yoy ?? null,
      counts: undefined
    }));
    return NextResponse.json(result);
  } catch (error) {
    console.error('[GET /api/lga/landmarks/destinations] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch destinations' }, { status: 500 });
  }
}
