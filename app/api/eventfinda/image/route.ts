import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const eventUrl = searchParams.get('url');

  if (!eventUrl) {
    return NextResponse.json({ error: 'Event URL is required' }, { status: 400 });
  }

  try {
    const response = await fetch(eventUrl);
    const html = await response.text();
    
    // Look for image URLs in the HTML that match the Eventfinda CDN pattern
    const imageUrlRegex = /https:\/\/cdn\.eventfinda\.com\.au\/uploads\/events\/transformed\/[^"'\s]+\.(jpg|png|jpeg)/i;
    const match = html.match(imageUrlRegex);
    
    return NextResponse.json({ imageUrl: match ? match[0] : null });
  } catch (error) {
    console.error(`Error fetching image for event ${eventUrl}:`, error);
    return NextResponse.json({ error: 'Failed to fetch image URL' }, { status: 500 });
  }
} 