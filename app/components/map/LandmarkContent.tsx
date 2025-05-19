import {
    FaBuilding,
    FaChurch,
    FaFireExtinguisher,
    FaMailBulk,
    FaLandmark,
    FaShip,
    FaUniversity,
} from "react-icons/fa";
import { useTheme } from "@/app/hooks/useTheme";

interface LandmarkContentProps {
    name: string;
    description: string;
    website: string;
    type: string;
}

const iconMap: { [key: string]: any } = {
    building: FaBuilding,
    church: FaChurch,
    "fire station": FaFireExtinguisher,
    "post office": FaMailBulk,
    "town hall": FaLandmark,
    wharf: FaShip,
    university: FaUniversity,
};

const LandmarkContent = ({
    name,
    description,
    website,
    type,
}: LandmarkContentProps) => {
    const { isDarkMode } = useTheme();
    const Icon = iconMap[type.trim().toLowerCase()] || FaBuilding;

    return (
        <div
            className={`w-[280px] text-sm font-sans rounded-lg shadow-lg p-3 ${
                isDarkMode ? "bg-gray-800" : "bg-white"
            }`}
        >
            <div className="flex items-start gap-3 mb-2">
                <div
                    className={`p-2 ${
                        isDarkMode ? "bg-indigo-900" : "bg-indigo-100"
                    } rounded-full ${
                        isDarkMode ? "text-indigo-300" : "text-indigo-700"
                    }`}
                >
                    <Icon className="text-xl" aria-label={type} />
                </div>
                <div className="flex-1">
                    <h2
                        className={`text-base font-semibold ${
                            isDarkMode ? "text-gray-100" : "text-gray-900"
                        } leading-tight`}
                    >
                        {name}
                    </h2>
                    <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${
                            isDarkMode ? "text-indigo-400" : "text-indigo-600"
                        } text-xs font-medium hover:underline`}
                    >
                        View on ILMS
                    </a>
                    <div
                        className={`mt-1 ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                        }`}
                    >
                        {description}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandmarkContent;
