"use client";

interface Workshop {
    id: string;
    name: string;
    provider_name: string;
    url: string;
}

interface WorkshopCardProps {
    workshop: Workshop;
}

export default function WorkshopCard({ workshop }: WorkshopCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="p-6 flex justify-between items-center">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {workshop.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {workshop.provider_name}
                    </p>
                </div>
                <div className="ml-6">
                    <a
                        href={workshop.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
                    >
                        View Workshop
                    </a>
                </div>
            </div>
        </div>
    );
}
