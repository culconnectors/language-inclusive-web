import { NextResponse } from 'next/server';
import { lgaClient } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { lgaCode: string } }
) {
  try {
    const { lgaCode } = params;

    if (!lgaCode || isNaN(Number(lgaCode))) {
      return NextResponse.json(
        { error: 'Invalid LGA code' },
        { status: 400 }
      );
    }

    const councilInfo = await lgaClient.$queryRaw`
      SELECT *
      FROM "CouncilInfo"
      WHERE lga_code = ${Number(lgaCode)}
    `;

    if (!councilInfo || (Array.isArray(councilInfo) && councilInfo.length === 0)) {
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
  } finally {
    await lgaClient.$disconnect();
  }
} 