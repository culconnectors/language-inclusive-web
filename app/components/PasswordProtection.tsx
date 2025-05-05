"use client";

import { useState, useEffect } from "react";

export function PasswordProtection({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const TIMEOUT_DURATION = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

    // Get password from environment variable with fallback
    const CORRECT_PASSWORD = process.env.NEXT_PUBLIC_WEBSITE_PASSWORD;

    useEffect(() => {
        // Validate environment variable
        if (!CORRECT_PASSWORD) {
            console.error("Website password not set in environment variables!");
            return;
        }

        // Check if already authorized in localStorage
        const authorized = localStorage.getItem("isAuthorized");
        const lastActivity = localStorage.getItem("lastActivity");
        const currentTime = new Date().getTime();

        if (authorized === "true" && lastActivity) {
            // Check if the session has expired
            if (currentTime - parseInt(lastActivity) > TIMEOUT_DURATION) {
                // Session expired, log out user
                handleLogout();
            } else {
                setIsAuthorized(true);
                // Update last activity time
                localStorage.setItem("lastActivity", currentTime.toString());
            }
        }
    }, []);

    useEffect(() => {
        if (isAuthorized) {
            // Set up activity listeners
            const updateLastActivity = () => {
                localStorage.setItem(
                    "lastActivity",
                    new Date().getTime().toString()
                );
            };

            // Set up the timeout checker
            const checkTimeout = setInterval(() => {
                const lastActivity = localStorage.getItem("lastActivity");
                const currentTime = new Date().getTime();

                if (
                    lastActivity &&
                    currentTime - parseInt(lastActivity) > TIMEOUT_DURATION
                ) {
                    handleLogout();
                }
            }, 60000); // Check every minute

            // Add event listeners for user activity
            window.addEventListener("mousemove", updateLastActivity);
            window.addEventListener("keypress", updateLastActivity);
            window.addEventListener("click", updateLastActivity);
            window.addEventListener("scroll", updateLastActivity);

            // Cleanup function
            return () => {
                clearInterval(checkTimeout);
                window.removeEventListener("mousemove", updateLastActivity);
                window.removeEventListener("keypress", updateLastActivity);
                window.removeEventListener("click", updateLastActivity);
                window.removeEventListener("scroll", updateLastActivity);
            };
        }
    }, [isAuthorized]);

    const handleLogout = () => {
        setIsAuthorized(false);
        localStorage.removeItem("isAuthorized");
        localStorage.removeItem("lastActivity");
        setPassword("");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!CORRECT_PASSWORD) {
            setError(
                "System configuration error. Please contact administrator."
            );
            return;
        }
        if (password === CORRECT_PASSWORD) {
            setIsAuthorized(true);
            localStorage.setItem("isAuthorized", "true");
            localStorage.setItem(
                "lastActivity",
                new Date().getTime().toString()
            );
            setError("");
        } else {
            setError("Incorrect password. Please try again.");
        }
    };

    if (isAuthorized) {
        return <>{children}</>;
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold mb-4 text-center text-white">
                    Password Required
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium mb-2 text-white"
                        >
                            Please enter the password to access the website
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
