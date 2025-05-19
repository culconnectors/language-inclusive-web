"use client";

import WorkshopCard from "./WorkshopCard";
import { useTheme } from "@/app/hooks/useTheme";

interface Coordinates {
    lat: number;
    lng: number;
}

interface Workshop {
    id: string;
    name: string;
    provider_name: string;
    description: string;
    url: string;
}

interface Pagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
}

interface WorkshopListProps {
    coordinates: Coordinates | null;
    workshops: Workshop[];
    pagination: Pagination;
    isLoading: boolean;
    onPageChange: (page: number) => void;
}

const LoadingSkeleton = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
            <div
                key={index}
                className="bg-gray-200 rounded-xl p-6 animate-pulse"
            >
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2" />
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-4" />
                <div className="h-10 bg-gray-300 rounded w-1/4" />
            </div>
        ))}
    </div>
);

export default function WorkshopList({
    coordinates,
    workshops,
    pagination,
    isLoading,
    onPageChange,
}: WorkshopListProps) {
    const { isDarkMode } = useTheme();

    if (!coordinates) {
        return null;
    }

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (!workshops.length) {
        return (
            <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                    <svg
                        className="w-12 h-12 mx-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                    </svg>
                </div>
                <h2
                    className={`text-xl font-semibold ${
                        isDarkMode ? "text-gray-200" : "text-gray-800"
                    } mb-2`}
                >
                    No Workshops Found
                </h2>
                <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                    Try adjusting your search or location to find workshops.
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="space-y-4 mb-8">
                {workshops.map((workshop) => (
                    <WorkshopCard key={workshop.id} workshop={workshop} />
                ))}
            </div>

            {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2">
                    <button
                        onClick={() => onPageChange(pagination.currentPage - 1)}
                        disabled={pagination.currentPage === 1}
                        className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                            isDarkMode
                                ? "bg-gray-800 text-gray-100 hover:bg-gray-700 disabled:bg-gray-800/50 disabled:text-gray-500"
                                : "bg-white text-gray-900 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                        } border ${
                            isDarkMode ? "border-gray-700" : "border-gray-300"
                        }`}
                    >
                        Previous
                    </button>
                    <span
                        className={`text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                    >
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasMore}
                        className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                            isDarkMode
                                ? "bg-gray-800 text-gray-100 hover:bg-gray-700 disabled:bg-gray-800/50 disabled:text-gray-500"
                                : "bg-white text-gray-900 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                        } border ${
                            isDarkMode ? "border-gray-700" : "border-gray-300"
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
