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

    const nationalityData = await lgaClient.lgaNationality.findMany({
      where: {
        lga_code: parseInt(lgaCode, 10)
      },
      select: {
        nationality: true,
        count: true
      },
      orderBy: {
        count: 'desc'
      }
    });

    return NextResponse.json(nationalityData);
  } catch (error) {
    console.error('Error fetching nationality data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch nationality data' },
      { status: 500 }
    );
  }
}
