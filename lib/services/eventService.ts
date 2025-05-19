import { communityClient } from "@/lib/prisma";

export async function getEventById(eventId: string) {
  try {
    const event = await communityClient.event.findUnique({
      where: {
        event_id: eventId,
      },
      include: {
        venue: true,
        organizer: true,
        logo: true,
      },
    });

    if (!event) {
      return null;
    }

    return {
      ...event,
      logo: event.logo
        ? {
            url: event.logo.logo_url,
          }
        : null,
    };
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
} 