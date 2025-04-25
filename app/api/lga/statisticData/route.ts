/**
 * This route is used to fetch the statistic data for the LGA map
 * curl "http://localhost:3000/api/lga/statisticData?stat=born_overseas" | jq
 */
import { NextResponse } from 'next/server';
import { lgaClient } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const stat = searchParams.get('stat');

    if (!stat) {
      return NextResponse.json(
        { error: 'Statistic key is required' },
        { status: 400 }
      );
    }

    const stats = await lgaClient.lgaStatistics.findMany({
      select: {
        lga_code: true,
        [stat]: true
      }
    });

    // Transform the data into the required format with LGA code and value
    const formattedStats = stats.map(statistic => ({
      lga_code: String(statistic.lga_code),
      value: statistic[stat as keyof typeof statistic]
    }));

    return NextResponse.json(formattedStats);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
