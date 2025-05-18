"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();
    const navItems = [
        { name: "Home", path: "/" },
        { name: "Events", path: "/events" },
        { name: "Workshops", path: "/workshops" },
        { name: "Community Explorer", path: "/community" },
        { name: "CulConnectorsAI", path: "/culconnectorsai" },
    ];

    return (
        <header className="fixed top-0 w-full bg-gray-900 backdrop-blur-sm z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link
                        href="/"
                        className="text-2xl font-semibold text-white"
                    >
                        SocialConnect
                    </Link>
                    <nav className="hidden md:flex space-x-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.path}
                                className={`transition-colors ${
                                    pathname === item.path
                                        ? "text-[#FABB20] border-b-2 border-[#FABB20]"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
