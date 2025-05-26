import Link from "next/link";

/**
 * Event not found page component
 * Features:
 * - Displays a user-friendly message when an event is not found
 * - Provides a link to browse all events
 * - Responsive and accessible design
 *
 * @returns {JSX.Element} The not found page for events
 */
export default function EventNotFound() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Event Not Found
                </h1>
                <p className="text-gray-600 mb-8">
                    The event you're looking for doesn't exist or has been
                    removed.
                </p>
                <Link
                    href="/events"
                    className="inline-block bg-[#FABB20] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#FABB20]/90 transition-colors"
                >
                    Browse Events
                </Link>
            </div>
        </div>
    );
}
