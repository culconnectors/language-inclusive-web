import { NextResponse } from 'next/server';
import { lgaClient } from "@/lib/prisma";



export async function GET() {
  try {
    const stats = await lgaClient.lgaStatistics.findMany({
      select: {
        total_businesses: true,
        total_employed_over_15: true,
        born_overseas: true,
        pct_arrived_within_5_years: true,
        pct_proficient_english: true,
        percent_speaks_other_lang_at_home: true,
        median_age_years: true,
        pct_completed_year_12: true,
        pct_certificate: true,
        pct_bachelor_degree: true,
        pct_postgraduate: true,
        pct_managers: true,
        pct_professionals: true,
        pct_labourers: true,
      },
      distinct: ['lga_code'],
    });

    // Transform the data into the required format
    const formattedStats = Object.keys(stats[0] || {}).map(key => ({
      name: key.replace(/_/g, ' ').replace(/pct/g, 'percentage'),
      id: key
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
