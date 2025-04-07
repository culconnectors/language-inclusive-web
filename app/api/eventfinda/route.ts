// route.ts
import { NextResponse } from "next/server";

const EVENTFINDA_USERNAME = process.env.EVENTFINDA_USERNAME;
const EVENTFINDA_PASSWORD = process.env.EVENTFINDA_PASSWORD;
const BASE_URL = "https://api.eventfinda.com.au/v2/events.json";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lat = searchParams.get("lat");
        const lng = searchParams.get("lng");
        const query = searchParams.get("q") || "";
        const radius = searchParams.get("radius") || "50"; // Default 50km radius
        const rows = searchParams.get("rows") || "6"; // Default to 6 events

        if (!EVENTFINDA_USERNAME || !EVENTFINDA_PASSWORD) {
            console.error("Eventfinda credentials are missing");
            return NextResponse.json(
                { error: "API credentials not configured" },
                { status: 500 }
            );
        }

        // Build URL with parameters
        let url = `${BASE_URL}?rows=${rows}`;

        // Add location-based search if coordinates provided
        if (lat && lng) {
            url += `&point=${lat},${lng}`;
            url += "&order=distance";
            url += `&radius=${radius}`;
        }

        // Add search query if provided
        if (query) {
            url += `&q=${encodeURIComponent(query)}`;
        }

        console.log("Calling Eventfinda API:", url);

        const response = await fetch(url, {
            headers: {
                Authorization:
                    "Basic " +
                    Buffer.from(
                        EVENTFINDA_USERNAME + ":" + EVENTFINDA_PASSWORD
                    ).toString("base64"),
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Eventfinda API error:", {
                status: response.status,
                statusText: response.statusText,
                error: errorText,
            });
            throw new Error("Failed to fetch events from Eventfinda");
        }

        const data = await response.json();

        // Transform the response to match our frontend expectations
        const events = data.events.map((event: any) => ({
            id: event.id,
            name: event.name,
            description: event.description,
            url: event.url,
            start: {
                local: event.datetime_start,
            },
            end: {
                local: event.datetime_end,
            },
            venue: {
                name: event.location?.name || "TBA",
                address: {
                    localized_address_display: [
                        event.location?.name,
                        event.location?.address,
                        event.location?.suburb,
                        event.location?.region,
                    ]
                        .filter(Boolean)
                        .join(", "),
                },
            },
            logo:
                event.images?.length > 0
                    ? {
                          url:
                              event.images[0].transforms?.find(
                                  (t: any) => t.transformation === "large"
                              )?.url || event.images[0].url,
                      }
                    : undefined,
        }));

        return NextResponse.json({ events });
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(
            { error: "Failed to fetch events" },
            { status: 500 }
        );
    }
}

// Optional: Add POST method if needed
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { latitude, longitude, query, radius = "10" } = body;

        // Eventfinda API credentials
        const username = process.env.EVENTFINDA_USERNAME || "apiusername";
        const password = process.env.EVENTFINDA_PASSWORD || "apipassword";

        // Build URL based on parameters
        let url = "https://api.eventfinda.com.au/v2/locations.json?rows=20";

        // Add search query if provided
        if (query) {
            url += "&q=" + encodeURIComponent(query);
        }

        // Add venue parameter
        url += "&venue=on";

        // Add location-based search if coordinates provided
        if (latitude && longitude) {
            url += "&point=" + latitude + "," + longitude;
            url += "&order=distance";
            url += "&radius=" + radius;
        }

        // Make API request with Basic Auth
        const response = await fetch(url, {
            headers: {
                Authorization:
                    "Basic " +
                    Buffer.from(username + ":" + password).toString("base64"),
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch data from Eventfinda API");
        }

        const data = await response.json();

        // Return the data
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching Eventfinda data:", error);
        return NextResponse.json(
            { error: "Failed to fetch location data" },
            { status: 500 }
        );
    }
}
