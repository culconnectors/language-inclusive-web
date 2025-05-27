"use client";

import { useEffect, useRef } from "react";

interface VideoPopupProps {
    /** Controls visibility of the popup */
    isOpen: boolean;
    /** Callback function to close the popup */
    onClose: () => void;
}

/**
 * Modal video popup component
 * Features:
 * - Fullscreen video display
 * - Click outside to close
 * - ESC key to close
 * - Responsive design
 * - Backdrop blur effect
 */
export default function VideoPopup({ isOpen, onClose }: VideoPopupProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Handle keyboard events and body scroll
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    /**
     * Handles click events on the overlay
     * Closes popup when clicking outside the video
     */
    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) onClose();
    };

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        >
            <div className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full">
                <button
                    onClick={onClose}
                    className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
                    aria-label="Close video"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>

                <div className="relative w-full h-0 pb-[56.25%]">
                    <iframe
                        src="https://streamable.com/e/feh8tr?"
                        className="absolute inset-0 w-full h-full rounded-xl border-none"
                        allow="fullscreen"
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
}
