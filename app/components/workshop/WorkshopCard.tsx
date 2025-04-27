"use client";

interface Workshop {
    id: string;
    name: string;
    provider_name: string;
    description: string;
    url: string;
}

interface WorkshopCardProps {
    workshop: Workshop;
}

export default function WorkshopCard({ workshop }: WorkshopCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {workshop.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                    {workshop.provider_name}
                </p>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {workshop.description}
                </p>
                <a
                    href={workshop.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                >
                    View Course
                </a>
            </div>
        </div>
    );
}
