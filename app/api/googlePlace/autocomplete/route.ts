import { NextResponse } from 'next/server';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const PLACES_AUTOCOMPLETE_API_URL = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const input = searchParams.get('input');

    if (!input) {
      return NextResponse.json(
        { error: 'Input is required' },
        { status: 400 }
      );
    }

    if (!GOOGLE_MAPS_API_KEY) {
      return NextResponse.json(
        { error: 'Google Maps API key is not configured' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `${PLACES_AUTOCOMPLETE_API_URL}?input=${encodeURIComponent(input)}&components=country:au&key=${GOOGLE_MAPS_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch place predictions');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching place predictions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch place predictions' },
      { status: 500 }
    );
  }
} 