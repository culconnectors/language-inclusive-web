'use client';
import { Languages, Briefcase, Users } from 'lucide-react';
import Navbar from '@/app/components/Navbar';
// import LocationSearch from '@/components/LocationSearch';
import ServiceCard from '@/app/components/ServiceCard';
import EventSearch from '@/app/components/EventSearch';
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
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Language shouldn't be a barrier to opportunities
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Connect with local support, jobs, events, and services in your area
          </p>
          
          <EventSearch />
        </div>
      </section>

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