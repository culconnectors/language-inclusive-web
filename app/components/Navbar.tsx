'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navItems = ['Home', 'Services', 'Community'];

  return (
    <header className="fixed top-0 w-full bg-stone-100 backdrop-blur-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-semibold text-blue-600">
            SocialConnect
          </Link>
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item}
                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                className="text-gray-700 hover:text-blue-600 hover:underline transition-colors"
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar; 