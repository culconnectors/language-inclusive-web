"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);
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

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            {mounted ? children : null}
        </QueryClientProvider>
    );
}
