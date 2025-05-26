"use client";

import WorkshopCard from "./WorkshopCard";

/**
 * Represents geographical coordinates
 */
interface Coordinates {
    /** Latitude value */
    lat: number;
    /** Longitude value */
    lng: number;
}

/**
 * Represents a workshop with its details
 */
interface Workshop {
    /** Unique identifier for the workshop */
    id: string;
    /** Name of the workshop */
    name: string;
    /** Name of the workshop provider */
    provider_name: string;
    /** Workshop description */
    description: string;
    /** URL to the workshop page */
    url: string;
}

/**
 * Represents pagination information
 */
interface Pagination {
    /** Current page number */
    currentPage: number;
    /** Total number of pages */
    totalPages: number;
    /** Total number of items */
    totalItems: number;
    /** Whether there are more pages */
    hasMore: boolean;
}

/**
 * Props for the WorkshopList component
 */
interface WorkshopListProps {
    /** Current location coordinates */
    coordinates: Coordinates | null;
    /** List of workshops to display */
    workshops: Workshop[];
    /** Pagination information */
    pagination: Pagination;
    /** Loading state indicator */
    isLoading: boolean;
    /** Callback when page changes */
    onPageChange: (page: number) => void;
}

/**
 * Loading skeleton component for workshop list
 * Displays placeholder cards while workshops are being loaded
 */
function LoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
                >
                    <div className="p-6 space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                        <div className="h-16 bg-gray-200 rounded" />
                        <div className="h-10 bg-gray-200 rounded w-32" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Workshop list component that displays a list of workshop cards
 * Features:
 * - Responsive list layout
 * - Loading skeleton
 * - Empty state handling
 * - Pagination controls
 * - Workshop card display
 * - Location-based filtering
 */
export default function WorkshopList({
    coordinates,
    workshops,
    pagination,
    isLoading,
    onPageChange,
}: WorkshopListProps) {
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
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    No Workshops Found
                </h2>
                <p className="text-gray-600">
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
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                    >
                        Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => onPageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasMore}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}
