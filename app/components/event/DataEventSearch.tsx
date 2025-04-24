// Project: event-search
/* File updated: 
    (2025-04-17) resetting location button
*/
'use client';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, Navigation, RefreshCw } from 'lucide-react';
import EventList from './EventList';
import LocationSearch from '../LocationSearch';
import { useLocationSearch } from '../../hooks/useLocationSearch';

// Define the API response type
interface EventBriteResponse {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
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

export default function DataEventSearch() {
  const {
    locationTerm,
    setLocationTerm,
    predictions,
    isLoading: isLocationLoading,
    selectedLocation,
    handlePredictionSelect,
    getCurrentLocation,
    resetLocation,
  } = useLocationSearch();

  // State to manage selected categories
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  // Fetch events from api endpoint based on selected location
  const { data: events = [], isLoading: isEventsLoading } = useQuery({
    queryKey: ['events', selectedLocation],
    queryFn: async (): Promise<EventBriteResponse[]> => {
      if (!selectedLocation) return [];
      const response = await fetch(
        `/api/eventBrite?lat=${selectedLocation.lat}&lng=${selectedLocation.lng}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      return response.json();
    },
    enabled: !!selectedLocation,
  });

  // Extract unique categories from events
  const allCategories: string[] = useMemo(() => {
    return [...new Set(events.map((event) => event.category).filter((c): c is string => Boolean(c)))];
  }, [events]);

  // Handle checkbox toggle
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  // Filter events by selected categories
  const filteredEvents = useMemo(() => {
    if (selectedCategories.size === 0) return events;
    
    return events.filter((event) => 
      event.category && selectedCategories.has(event.category)
    );
  }, [events, selectedCategories]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <LocationSearch
              onLocationSelect={() => {}}
              predictions={predictions}
              loading={isLocationLoading}
              locationTerm={locationTerm}
              onLocationTermChange={setLocationTerm}
              onPredictionSelect={handlePredictionSelect}
            />
          </div>
          <button
            onClick={getCurrentLocation}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300 flex items-center gap-2"
          >
            <Navigation className="w-4 h-4" />
            Current Location
          </button>
          {/* This button is for resetting the location */}
          <button
            onClick={resetLocation}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors duration-300 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            New Search
          </button>
        </div>
        {selectedLocation && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>Showing events within 20km of selected location</span>
          </div>
        )}

        {allCategories.length > 0 && (
          <div className="mb-6">
            <p className="font-medium mb-2">Filter by Categories:</p>
            <div className="flex flex-wrap gap-4">
              {allCategories.map((category) => (
                <label key={category} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedCategories.has(category)}
                    onChange={() => handleCategoryToggle(category)}
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>


      <EventList 
        coordinates={selectedLocation}
        events={filteredEvents}
        isLoading={isEventsLoading}
      />
    </div>
  );
}
