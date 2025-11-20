import Image from 'next/image';

import type { HomeServicesSection } from '@/lib/content/defaults';
import { DEFAULT_CONTENT } from '@/lib/content/defaults';

interface ServicesProps {
  content?: HomeServicesSection;
}

const Services = ({ content }: ServicesProps) => {
  const section = content ?? DEFAULT_CONTENT.home_page.servicesSection;
  const services = section.services;

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
            {section.title}
          </h2>
          <div className="w-24 h-1 bg-primary-500 mx-auto mb-8"></div>
          {section.description && (
            <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
              {section.description}
            </p>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-2 group"
            >
              <div className="relative h-60">
                <Image 
                  src={service.imageUrl}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white font-serif">
                    {service.title}
                  </h3>
                  <span className="text-accent-600 dark:text-accent-400 font-bold text-xl">
                    {service.price}€
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {service.description}
                </p>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                    <span>{service.duration}</span>
                    <span>{service.level}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {service.schedule}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;