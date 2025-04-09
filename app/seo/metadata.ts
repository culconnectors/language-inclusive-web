import { Metadata } from 'next';

interface Location {
  latitude: number;
  longitude: number;
  city: string;
  state: string;
}

interface MetadataProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  location?: Location | null;
  eventType?: string | null;
}

export const metadata: Metadata = {
  title: 'SocialConnect – A bridge between cultures and languages',
  description: 'Connect with local support, jobs, events, and services in your area, breaking down language barriers for immigrants in Australia.',
};

export function generateMetadata({ 
  title, 
  description, 
  canonicalUrl,
  location = null,
  eventType = null
}: MetadataProps) {
  const baseTitle = 'SocialConnect';
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;
  const defaultDescription = 'Connect with local support, jobs, events, and services in your area';
  
  return {
    title: fullTitle,
    description: description || defaultDescription,
    canonical: canonicalUrl,
    openGraph: {
      title: fullTitle,
      description: description || defaultDescription,
      type: eventType ? 'event' : 'website',
      locale: 'en_AU',
      ...(location && {
        latitude: location.latitude,
        longitude: location.longitude,
        locality: location.city,
        region: location.state,
        country_name: 'Australia'
      })
    },
    ...(eventType && {
      eventType: eventType,
      'og:type': 'event'
    })
  };
} 