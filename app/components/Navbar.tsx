"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "@/app/hooks/useTheme";

const Navbar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 850);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Events", path: "/events" },
        { name: "Workshops", path: "/workshops" },
        { name: "Community Explorer", path: "/community" },
        { name: "CulConnectorsAI", path: "/culconnectorsai" },
    ];

    const Sidebar = () => (
        <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed top-0 right-0 h-full w-[250px] bg-white dark:bg-gray-900 shadow-lg z-50"
        >
            <div className="p-4">
                <div className="flex justify-between items-center mb-8">
                    <Link
                        href="/"
                        className="text-2xl font-semibold text-gray-900 dark:text-white"
                    >
                        SocialConnect
                    </Link>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X size={24} />
                    </button>
                </div>
                <nav className="flex flex-col space-y-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.path}
                            onClick={() => setIsOpen(false)}
                            className={`transition-colors px-4 py-2 rounded-md ${
                                pathname === item.path
                                    ? "text-[#FABB20] bg-gray-100 dark:bg-gray-800"
                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </motion.div>
    );

    return (
        <>
            <header className="fixed top-0 w-full bg-white dark:bg-gray-900 backdrop-blur-sm z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <Link
                            href="/"
                            className="text-2xl font-semibold text-gray-900 dark:text-white"
                        >
                            SocialConnect
                        </Link>
                        {!isMobile ? (
                            <div className="flex items-center space-x-8">
                                <nav className="flex space-x-8">
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.path}
                                            className={`transition-colors ${
                                                pathname === item.path
                                                    ? "text-[#FABB20] border-b-2 border-[#FABB20]"
                                                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                            }`}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                                <button
                                    onClick={toggleTheme}
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    aria-label="Toggle dark mode"
                                >
                                    {isDarkMode ? (
                                        <Sun size={20} />
                                    ) : (
                                        <Moon size={20} />
                                    )}
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={toggleTheme}
                                    className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    aria-label="Toggle dark mode"
                                >
                                    {isDarkMode ? (
                                        <Sun size={20} />
                                    ) : (
                                        <Moon size={20} />
                                    )}
                                </button>
                                <button
                                    onClick={() => setIsOpen(true)}
                                    className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <Menu size={24} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>
            <AnimatePresence>
                {isOpen && isMobile && <Sidebar />}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
