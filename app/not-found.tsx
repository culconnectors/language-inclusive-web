"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
