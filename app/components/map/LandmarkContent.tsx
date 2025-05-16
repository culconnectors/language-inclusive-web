import {
  FaChurch,
  FaFireExtinguisher,
  FaMailBulk,
  FaLandmark,
  FaUniversity,
  FaBuilding,
  FaShip,
} from 'react-icons/fa';

interface LandmarkContentProps {
  name: string;
  description: string;
  website: string;
  type: string;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'church': FaChurch,
  'fire station': FaFireExtinguisher,
  'post office': FaMailBulk,
  'town hall': FaLandmark,
  'wharf': FaShip,
  'university': FaUniversity,
};

const LandmarkContent = ({ name, description, website, type }: LandmarkContentProps) => {
  const Icon = iconMap[type.trim().toLowerCase()] || FaBuilding;

  return (
    <div className="w-[280px] text-sm font-sans rounded-lg shadow-lg p-3 bg-white">
      <div className="flex items-start gap-3 mb-2">
        <div className="p-2 bg-indigo-100 rounded-full text-indigo-700">
          <Icon className="text-xl" aria-label={type} />
        </div>
        <div className="flex-1">
          <h2 className="text-base font-semibold text-gray-900 leading-tight">{name}</h2>
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 text-xs font-medium hover:underline"
          >
            View on ILMS
          </a>
          <div className="mt-1">
            <span className="inline-block text-[10px] px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full uppercase tracking-wide">
              {type}
            </span>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-700 leading-snug max-h-[140px] overflow-auto pr-1">
        {description}
      </p>
    </div>
  );
};

export default LandmarkContent;
