import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

interface Coordinates {
  lat: number;
  lng: number;
}

interface UseLocationSearchProps {
  onLocationSelect?: (coords: Coordinates) => void;
}

export function useLocationSearch({ onLocationSelect }: UseLocationSearchProps = {}) {
  const [locationTerm, setLocationTerm] = useState('');
  const [debouncedLocation] = useDebounce(locationTerm, 500);
  const [predictions, setPredictions] = useState<Array<{
    description: string;
    place_id: string;
  }>>([]);
  const [loading, setLoading] = useState(false);

  // Get current location with reverse geocoding
  const getCurrentLocation = async () => {
    if (navigator.geolocation) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });
  
        const { latitude, longitude } = position.coords;
        console.log(`Raw coordinates: ${latitude}, ${longitude}`);
        
        // Use Google's Geocoding API with specific result types for smaller areas
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&result_type=locality|sublocality|neighborhood&components=country:AU`
        );
        
        const data = await response.json();
        console.log('Geocoding API response:', data);
        
        if (data.results && data.results.length > 0) {
          // Extract components to build a more specific location string
          const result = data.results[0];
          let suburb = '';
          let state = '';
          let country = '';
          
          // Extract components from address_components
          result.address_components.forEach((component: { types: string | string[]; short_name: string; }) => {
            if (component.types.includes('locality') || component.types.includes('sublocality') || component.types.includes('neighborhood')) {
              suburb = component.short_name;
            }
            if (component.types.includes('administrative_area_level_1')) {
              state = component.short_name;
            }
            if (component.types.includes('country')) {
              country = component.short_name;
            }
          });
          
          // Build formatted address with preference for smaller area
          const formattedAddress = suburb 
            ? `${suburb}${state ? ', ' + state : ''}${country ? ', ' + country : ''}`
            : result.formatted_address;
          
          console.log('Selected location:', formattedAddress);
          setLocationTerm(formattedAddress);
          onLocationSelect?.({ lat: latitude, lng: longitude });
        } else {
          // Fallback to a second request if first one doesn't return results
          const fallbackResponse = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&result_type=locality|administrative_area_level_1|country&components=country:AU`
          );
          
          const fallbackData = await fallbackResponse.json();
          console.log('Fallback geocoding response:', fallbackData);
          
          if (fallbackData.results && fallbackData.results.length > 0) {
            const formattedAddress = fallbackData.results[0].formatted_address;
            console.log('Fallback location:', formattedAddress);
            setLocationTerm(formattedAddress);
            onLocationSelect?.({ lat: latitude, lng: longitude });
          }
        }
      } catch (error) {
        console.error('Error getting location:', error);
      }
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    const fetchPredictions = async () => {
      if (!debouncedLocation) {
        setPredictions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `/api/places?input=${encodeURIComponent(debouncedLocation)}`
        );
        const data = await response.json();
        setPredictions(data.predictions || []);
      } catch (error) {
        console.error('Error fetching predictions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [debouncedLocation]);

  const handlePredictionSelect = async (placeId: string, description: string) => {
    try {
      const response = await fetch(`/api/places/details?placeId=${placeId}`);
      const data = await response.json();
      
      if (data.result?.geometry?.location) {
        const { lat, lng } = data.result.geometry.location;
        setLocationTerm(description);
        onLocationSelect?.({ lat, lng });
        setPredictions([]);
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
    }
  };

  const resetLocation = () => {
    setLocationTerm('');
    setPredictions([]);
  };

  return {
    locationTerm,
    setLocationTerm,
    predictions,
    loading,
    handlePredictionSelect,
    resetLocation,
    getCurrentLocation,
  };
} 