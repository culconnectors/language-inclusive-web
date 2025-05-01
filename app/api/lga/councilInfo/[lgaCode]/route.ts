import { NextResponse } from 'next/server';
import { lgaClient } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { lgaCode: string } }
) {
  try {
    const lgaCode = parseInt(params.lgaCode);

    if (isNaN(lgaCode)) {
      return NextResponse.json(
        { error: 'Invalid LGA code' },
        { status: 400 }
      );
    }

    // Fetch council info using Prisma
    const councilInfo = await lgaClient.councilInfo.findUnique({
      where: {
        lga_code: lgaCode,
      },
      include: {
        lga: true, // Include related LGA data
      },
    });

    if (!councilInfo) {
      return NextResponse.json(
        { error: 'No council information found for that LGA code' },
        { status: 404 }
      );
    }

    return NextResponse.json(councilInfo);
  } catch (error) {
    console.error('Council info lookup failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 