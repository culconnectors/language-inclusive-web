// This file contains a custom hook for managing location search functionality.
/* File updated: 
  (2025-04-17) Added a button to reset the location
  (2025-04-20) Filter predictions to avioid duplicates
  (2025-04-20) to get the current location and fetch the address (Geocoding API)
*/

import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { set } from "date-fns";

interface Coordinates {
    lat: number;
    lng: number;
}

// Prediction location and postcode within  from the autocomplete API
interface Prediction {
    description: string;
    place_id: string;
    postcode?: string;
}

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
export function useLocationSearch() {
    const [locationTerm, setLocationTerm] = useState("");
    const [selectedLocation, setSelectedLocation] =
        useState<Coordinates | null>(null);
    const [selectedPostcode, setSelectedPostcode] = useState<string | null>(
        null
    );

    const { data: predictionsRaw = [], isLoading } = useQuery<Prediction[]>({
        queryKey: ["locationPredictions", locationTerm],
        queryFn: async () => {
            if (!locationTerm) return [];
            const response = await fetch(
                `/api/googlePlace/autocomplete?input=${encodeURIComponent(
                    locationTerm
                )}`
            );
            if (!response.ok) throw new Error("Failed to fetch predictions");
            const data = await response.json();
            return data.predictions || [];
        },
        enabled: locationTerm.length > 2,
    });

    // Deduplicate predictions
    const predictions = Array.from(
        new Map(
            predictionsRaw.map((pred) => [pred.description, pred]) // key by description
        ).values()
    );

    const handlePredictionSelect = useCallback(
        async (placeId: string, description: string) => {
            try {
                const response = await fetch(
                    `/api/googlePlace/details?placeId=${placeId}`
                );
                if (!response.ok)
                    throw new Error("Failed to fetch place details");
                const data = await response.json();

                const location = data?.location;
                const postcode = data?.postcode || null;

                if (location) {
                    setSelectedLocation(location);
                    setSelectedPostcode(postcode);
                    setLocationTerm(description);
                }
            } catch (error) {
                console.error("Error fetching place details:", error);
            }
        },
        []
    );

    const getCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            console.warn("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };

                setSelectedLocation(coords);
                setSelectedPostcode(null);

                try {
                    // ⬇️ Fetch human-readable address from Google reverse geocoding API
                    const response = await fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${GOOGLE_MAPS_API_KEY}`
                    );
                    const data = await response.json();
                    console.log("Reverse geocoding data:", data);
                    if (data.status === "OK" && data.results.length > 0) {
                        // Look through results for a locality (suburb)
                        const suburbResult = data.results.find(
                            (result: any) =>
                                result.types.includes("locality") ||
                                result.types.includes("postal_town")
                        );

                        const fallbackResult = data.results[0];

                        const address =
                            suburbResult?.formatted_address ||
                            fallbackResult?.formatted_address;

                        if (address) {
                            setLocationTerm(address);
                        } else {
                            console.warn(
                                "No suburb or address found for current location"
                            );
                        }
                    } else {
                        console.warn("No address found for current location");
                    }
                } catch (error) {
                    console.error("Reverse geocoding error:", error);
                }
            },
            (error) => {
                // Only log error and show alert if permission is denied
                if (error.code === error.PERMISSION_DENIED) {
                    console.error("Error getting current location:", error);
                    alert(
                        "Location permission denied. Please enable location access to use this feature."
                    );
                }
            }
        );
    }, []);

    const resetLocation = useCallback(() => {
        setLocationTerm("");
        setSelectedLocation(null);
    }, []);

    return {
        locationTerm,
        setLocationTerm,
        predictions,
        isLoading,
        selectedLocation,
        selectedPostcode,
        handlePredictionSelect,
        getCurrentLocation,
        resetLocation,
    };
}
