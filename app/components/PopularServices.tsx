"use client";

import { Languages, Briefcase, Users } from "lucide-react";
import ServiceCard from "@/app/components/ServiceCard";
import { useTheme } from "@/app/hooks/useTheme";

const services = [
    {
        title: "CulConnectorsAI",
        icon: Languages,
        description:
            "Connect with certified translators who understand your needs and help bridge the language gap.",
        href: "/culconnectorsai",
    },
    {
        title: "Locally-Run Workshops",
        icon: Briefcase,
        description:
            "Join English language workshops run by experienced teachers in your local community.",
        href: "/services/workshops",
    },
    {
        title: "Community Events",
        icon: Users,
        description:
            "Discover and participate in local events that celebrate diversity and foster connections.",
        href: "/services/events",
    },
];

export default function PopularServices() {
    const { isDarkMode } = useTheme();

    return (
        <section
            className={`py-16 px-4 sm:px-6 lg:px-8 ${
                isDarkMode ? "bg-gray-800" : "bg-gray-50"
            }`}
        >
            <div className="max-w-7xl mx-auto">
                <h2
                    className={`text-3xl font-bold ${
                        isDarkMode ? "text-white" : "text-gray-900"
                    } text-center mb-12`}
                >
                    Popular Services
                </h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <ServiceCard
                            key={service.title}
                            {...service}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
