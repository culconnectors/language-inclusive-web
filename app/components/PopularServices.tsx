"use client";

import { Languages, Briefcase, Users, LucideIcon } from "lucide-react";
import ServiceCard from "./ServiceCard";

interface Service {
    title: string;
    icon: LucideIcon;
    description: string;
}

interface PopularServicesProps {
    services?: Service[];
    title?: string;
    className?: string;
}

const defaultServices: Service[] = [
    {
        title: "Translation Services",
        icon: Languages,
        description:
            "Connect with certified translators who understand your needs and help bridge the language gap.",
    },
    {
        title: "Locally-Run Workshops",
        icon: Briefcase,
        description:
            "Join English language workshops run by experienced teachers in your local community.",
    },
    {
        title: "Community Events",
        icon: Users,
        description:
            "Discover and participate in local events that celebrate diversity and foster connections.",
    },
];

export default function PopularServices({
    services = defaultServices,
    title = "Popular Services",
    className = "",
}: PopularServicesProps) {
    return (
        <section
            className={`py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 ${className}`}
        >
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                    {title}
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
