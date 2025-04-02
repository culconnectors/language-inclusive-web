'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LocationSearch from '@/app/components/LocationSearch';
import EventList from './EventList';
import { useLocationSearch } from '../hooks/useLocationSearch';

const queryClient = new QueryClient();

interface Coordinates {
  lat: number;
  lng: number;
}

interface Event {
  id: string;
  name: string;
  description: string;
  url: string;
  start: {
    local: string;
  };
  end: {
    local: string;
  };
  venue: {
    name: string;
    address: {
      localized_address_display: string;
    };
  };
  logo?: {
    url: string;
  };
}

export default function EventSearch() {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    locationTerm,
    setLocationTerm,
    predictions,
    loading,
    handlePredictionSelect,
    resetLocation,
    getCurrentLocation,
  } = useLocationSearch({
    onLocationSelect: async (coords) => {
      setCoordinates(coords);
      setIsLoading(true);
      try {
        const res = await fetch(`/api/eventfinda?lat=${coords.lat}&lng=${coords.lng}`);
        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await res.json();
        
        // Fetch images for each event
        const eventsWithImages = await Promise.all(
          (data.events || []).map(async (event: Event) => {
            try {
              const imageRes = await fetch(`/api/eventfinda/image?url=${encodeURIComponent(event.url)}`);
              if (!imageRes.ok) {
                throw new Error('Failed to fetch image URL');
              }
              const imageData = await imageRes.json();
              return {
                ...event,
                logo: imageData.imageUrl ? { url: imageData.imageUrl } : undefined
              };
            } catch (error) {
              console.error(`Error fetching image for event ${event.id}:`, error);
              return event;
            }
          })
        );
        
        setEvents(eventsWithImages);
      } catch (error) {
        console.error('Error fetching events:', error);
        setEvents([]);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleNewSearch = () => {
    resetLocation();
    setCoordinates(null);
    setEvents([]);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Discover Events Near You
          </h1>
          <div className="flex flex-col space-y-4">
            <LocationSearch
              onLocationSelect={() => {}}
              predictions={predictions}
              loading={loading}
              locationTerm={locationTerm}
              onLocationTermChange={setLocationTerm}
              onPredictionSelect={handlePredictionSelect}
            />
            <div className="flex space-x-4">
              <button
                onClick={handleNewSearch}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                New Search
              </button>
              <button
                onClick={getCurrentLocation}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                Use Current Location
              </button>
            </div>
          </div>
        </div>

        <EventList 
          coordinates={coordinates} 
          events={events} 
          isLoading={isLoading} 
        />
      </div>
    </QueryClientProvider>
  );
}