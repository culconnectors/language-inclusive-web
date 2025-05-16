import { NextResponse } from 'next/server';
import { lgaClient } from "@/lib/prisma";

/**
 * GET handler for fetching language data for a given LGA.
 *
 * @param {Request} request - The incoming request object.
 * @returns {Promise<NextResponse>} JSON array of language and count or error.
 *
 * - Expects `lgaCode` as a query parameter.
 * - Returns array of { language, count }.
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

    const languageData = await lgaClient.lgaLanguageProficiency.findMany({
      where: {
        lga_code: parseInt(lgaCode, 10)
      },
      select: {
        language: true,
        count: true
      },
      orderBy: {
        count: 'desc'
      }
    });

    return NextResponse.json(languageData);
  } catch (error) {
    console.error('Error fetching language data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch language data' },
      { status: 500 }
    );
  }
}
