"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        // Check if we're in the browser
        if (typeof window !== "undefined") {
            // Get the stored theme from localStorage
            const storedTheme = localStorage.getItem("theme");

            // If there's a stored theme, use it
            if (storedTheme) {
                const isDark = storedTheme === "dark";
                setIsDarkMode(isDark);
                if (isDark) {
                    document.documentElement.classList.remove("light");
                    document.documentElement.classList.add("dark");
                } else {
                    document.documentElement.classList.remove("dark");
                    document.documentElement.classList.add("light");
                }
            } else {
                // Otherwise, check system preference
                const prefersDark = window.matchMedia(
                    "(prefers-color-scheme: dark)"
                ).matches;
                setIsDarkMode(prefersDark);
                if (prefersDark) {
                    document.documentElement.classList.remove("light");
                    document.documentElement.classList.add("dark");
                } else {
                    document.documentElement.classList.remove("dark");
                    document.documentElement.classList.add("light");
                }
                // Store the initial theme preference
                localStorage.setItem("theme", prefersDark ? "dark" : "light");
            }
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode((prev) => {
            const newTheme = !prev;
            // Store the new theme preference
            localStorage.setItem("theme", newTheme ? "dark" : "light");
            // Toggle the dark class on the HTML element
            if (newTheme) {
                document.documentElement.classList.remove("light");
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
                document.documentElement.classList.add("light");
            }
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}

export { ThemeProvider };
