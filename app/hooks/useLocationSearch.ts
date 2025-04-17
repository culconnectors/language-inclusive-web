import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";

interface Coordinates {
    lat: number;
    lng: number;
}

interface Prediction {
    description: string;
    place_id: string;
}

export function useLocationSearch() {
    const [locationTerm, setLocationTerm] = useState("");
    const [selectedLocation, setSelectedLocation] =
        useState<Coordinates | null>(null);

    const { data: predictions = [], isLoading } = useQuery({
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

    const handlePredictionSelect = useCallback(
        async (placeId: string, description: string) => {
            try {
                const response = await fetch(
                    `/api/googlePlace/details?placeId=${placeId}`
                );
                if (!response.ok)
                    throw new Error("Failed to fetch place details");
                const data = await response.json();

                if (data.result?.geometry?.location) {
                    const { lat, lng } = data.result.geometry.location;
                    setSelectedLocation({ lat, lng });
                }
            } catch (error) {
                console.error("Error fetching place details:", error);
            }
        },
        []
    );

    const getCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        try {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setSelectedLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    // Only show errors for actual geolocation failures
                    if (error instanceof GeolocationPositionError) {
                        let message = "Unable to retrieve your location";
                        switch (error.code) {
                            case GeolocationPositionError.PERMISSION_DENIED:
                                message =
                                    "Please allow location access to use this feature";
                                break;
                            case GeolocationPositionError.POSITION_UNAVAILABLE:
                                message = "Location information is unavailable";
                                break;
                            case GeolocationPositionError.TIMEOUT:
                                message = "Location request timed out";
                                break;
                        }
                        alert(message);
                        console.error("Geolocation error:", error);
                    }
                    // Ignore errors from browser extensions
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0,
                }
            );
        } catch (error) {
            // Suppress any other errors that might be caused by extensions
        }
    }, []);

    return {
        locationTerm,
        setLocationTerm,
        predictions,
        isLoading,
        selectedLocation,
        handlePredictionSelect,
        getCurrentLocation,
    };
}
