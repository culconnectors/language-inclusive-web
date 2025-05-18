"use client";

import { useEffect, useState } from "react";

const languages = [
    { text: "Language", color: "#FF6B6B", lang: "en" },
    { text: "Idioma", color: "#4ECDC4", lang: "es" },
    { text: "语言", color: "#45B7D1", lang: "zh" },
    { text: "Langue", color: "#96CEB4", lang: "fr" },
    { text: "Ngôn ngữ", color: "#FFBE0B", lang: "vi" },
    { text: "Bahasa", color: "#FF006E", lang: "id" },
    { text: "भाषा", color: "#8338EC", lang: "hi" },
    { text: "言語", color: "#3A86FF", lang: "ja" },
];

export default function LanguageCycle() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % languages.length);
                setIsTransitioning(false);
            }, 200); // Half of the transition duration
        }, 2000); // Change every 2 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <span
            className={`inline-block transition-opacity duration-400 ${
                isTransitioning ? "opacity-0" : "opacity-100"
            }`}
            style={{ color: languages[currentIndex].color }}
            lang={languages[currentIndex].lang}
        >
            {languages[currentIndex].text}
        </span>
    );
} 