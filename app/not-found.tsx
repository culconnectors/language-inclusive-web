"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * 404 Not Found page component
 * Automatically redirects to homepage after a brief delay
 */
export default function NotFound() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to homepage after a brief delay
        const redirectTimeout = setTimeout(() => {
            router.push("/");
        }, 100);

        return () => clearTimeout(redirectTimeout);
    }, [router]);

    return null; // No need to render anything as we're redirecting immediately
}
