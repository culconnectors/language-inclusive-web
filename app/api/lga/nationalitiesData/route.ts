import { NextResponse } from 'next/server';
import { lgaClient } from "@/lib/prisma";

/**
 * GET handler for fetching top 10 non-Australian nationalities for a given LGA.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} JSON array of nationality and count or error.
 *
 * - Expects `lgaCode` as a query parameter.
 * - Excludes Australia, New Zealand, England.
 * - Returns 400 for missing code, 500 for server error.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lgaCode = searchParams.get('lgaCode');

    if (!lgaCode) {
      return NextResponse.json(
        { error: 'LGA code is required' },
        { status: 400 }
      );
    }

    const nationalityData = await lgaClient.lgaNationality.findMany({
      where: {
        lga_code: parseInt(lgaCode, 10),
        nationality: {
          NOT: {
            nationality: {
              in: ['Australia', 'New Zealand', 'England']
            }
          }
        }
      },
      select: {
        nationality: {
          select: {
            nationality: true
          }
        },
        count: true
      },
      orderBy: {
        count: 'desc'
      },
      take: 10
    });

    // Transform the data to match the expected format
    const formattedData = nationalityData.map(item => ({
      nationality: item.nationality.nationality,
      count: item.count
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching nationality data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nationality data' },
      { status: 500 }
    );
  }
}
