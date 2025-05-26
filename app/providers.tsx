"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";

/**
 * Global providers wrapper component
 * Handles client-side hydration and provides React Query functionality
 * @param children - Child components to be rendered
 */
export function Providers({ children }: { children: React.ReactNode }) {
    // Track client-side mounting state
    const [mounted, setMounted] = useState(false);

    // Initialize React Query client with custom configuration
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        refetchOnWindowFocus: false,
                        staleTime: 60 * 1000, // 1 minute
                    },
                },
            })
    );

    // Set mounted state on client-side
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            {mounted ? children : null}
        </QueryClientProvider>
    );
}
