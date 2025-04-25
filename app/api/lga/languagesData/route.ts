import { NextResponse } from 'next/server';
import { lgaClient } from "@/lib/prisma";

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
