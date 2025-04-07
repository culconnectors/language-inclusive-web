"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface ServiceCardProps {
    title: string;
    icon: LucideIcon;
    description: string;
    index: number;
}

const ServiceCard = ({
    title,
    icon: Icon,
    description,
    index,
}: ServiceCardProps) => {
    const router = useRouter();

    const getServicePath = (title: string) => {
        switch (title) {
            case "Translation Services":
                return "/translation";
            case "Locally-Run Workshops":
                return "/workshops";
            case "Community Events":
                return "/events";
            default:
                return "/";
        }
    };

    return (
        <motion.div
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            onClick={() => router.push(getServicePath(title))}
        >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Icon className="text-blue-600" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {title}
            </h3>
            <p className="text-gray-600">{description}</p>
        </motion.div>
    );
};

export default ServiceCard;
