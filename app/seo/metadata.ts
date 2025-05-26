import { Metadata } from "next";

/**
 * Represents a location for SEO metadata
 * @property latitude - Latitude value
 * @property longitude - Longitude value
 * @property city - City name
 * @property state - State or region
 */
interface Location {
    latitude: number;
    longitude: number;
    city: string;
    state: string;
}

/**
 * Props for generating SEO metadata
 * @property title - Page title
 * @property description - Page description
 * @property canonicalUrl - Canonical URL for the page
 * @property location - Optional location information
 * @property eventType - Optional event type for Open Graph
 */
interface MetadataProps {
    title?: string;
    description?: string;
    canonicalUrl?: string;
    location?: Location | null;
    eventType?: string | null;
}

/**
 * Default site-wide metadata for SEO
 * @type {Metadata}
 */
export const metadata: Metadata = {
    title: "SocialConnect – A bridge between cultures and languages",
    description:
        "Connect with local support, jobs, events, and services in your area, breaking down language barriers for immigrants in Australia.",
};

/**
 * Generates SEO metadata for a page
 * Features:
 * - Customizes title, description, canonical URL, and Open Graph fields
 * - Supports event and location-specific metadata
 *
 * @param {MetadataProps} props - Metadata generation options
 * @returns {object} Generated metadata object
 */
export function generateMetadata({
    title,
    description,
    canonicalUrl,
    location = null,
    eventType = null,
}: MetadataProps) {
    const baseTitle = "SocialConnect";
    const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
    const defaultDescription =
        "Connect with local support, jobs, events, and services in your area";

    return {
        title: fullTitle,
        description: description || defaultDescription,
        canonical: canonicalUrl,
        openGraph: {
            title: fullTitle,
            description: description || defaultDescription,
            type: eventType ? "event" : "website",
            locale: "en_AU",
            ...(location && {
                latitude: location.latitude,
                longitude: location.longitude,
                locality: location.city,
                region: location.state,
                country_name: "Australia",
            }),
        },
        ...(eventType && {
            eventType: eventType,
            "og:type": "event",
        }),
    };
}
