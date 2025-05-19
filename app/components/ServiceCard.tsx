"use client";

import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTheme } from "@/app/hooks/useTheme";

interface ServiceCardProps {
    title: string;
    icon: LucideIcon;
    description: string;
    index: number;
    href: string;
}

const ServiceCard = ({
    title,
    icon: Icon,
    description,
    index,
    href,
}: ServiceCardProps) => {
    const { isDarkMode } = useTheme();

    return (
        <Link href={href} className="h-full">
            <motion.div
                className={`p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer h-full flex flex-col ${
                    isDarkMode ? "bg-gray-700" : "bg-white"
                }`}
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
            >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="text-blue-600" size={24} />
                </div>
                <h3
                    className={`text-xl font-semibold mb-3 ${
                        isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                >
                    {title}
                </h3>
                <p
                    className={`flex-grow ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                >
                    {description}
                </p>
            </motion.div>
        </Link>
    );
};

export default ServiceCard;
