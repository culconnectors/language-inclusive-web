/**
 * @module lib/services/eventService
 * @description Service functions for managing event-related operations in the community database.
 */

import { communityClient } from "@/lib/prisma";

/**
 * Retrieves a specific event by its ID, including related venue, organizer, and logo information.
 *
 * @param {string} eventId - The unique identifier of the event to retrieve
 * @returns {Promise<Object|null>} The event object with related data, or null if not found
 * @throws {Error} If there is an error fetching the event from the database
 *
 * @example
 * const event = await getEventById("123");
 * if (event) {
 *   console.log(event.name, event.venue.name);
 * }
 */
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
