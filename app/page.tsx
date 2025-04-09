'use client';
import { Languages, Briefcase, Users } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
import ServiceCard from '@/app/components/ServiceCard';
import EventSearch from '@/app/components/DataEventSearch';
import LandingCarousel from '@/app/components/landingCarousel';

const services = [
  {
    title: 'Translation Services',
    icon: Languages,
    description: 'Connect with certified translators who understand your needs and help bridge the language gap.'
  },
  {
    title: 'Locally-Run Workshops',
    icon: Briefcase,
    description: 'Join English language workshops run by experienced teachers in your local community.'
  },
  {
    title: 'Community Events',
    icon: Users,
    description: 'Discover and participate in local events that celebrate diversity and foster connections.'
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <LandingCarousel />
  

      {/* Popular Services Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
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

    </main>
  );
} 