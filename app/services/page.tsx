import Image from 'next/image';
import Link from 'next/link';

import { getServicesPageContent } from '@/lib/content/server';

export default async function ServicesPage() {
  const content = await getServicesPageContent();

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="bg-cream py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-sage mb-8">
            {content.hero.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.hero.subtitle}
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.services.map((service, index) => (
              <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="relative h-64">
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    fill
                    className="object-cover pointer-events-none"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-serif text-sage">{service.title}</h3>
                    <span className="text-gold font-medium">{service.price}</span>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Durée: {service.duration}</span>
                  </div>
                  <Link
                    href="/reservation"
                    className="block text-center bg-sage hover:bg-gold text-white py-3 px-6 rounded-full mt-6 transition-colors duration-300"
                  >
                    Réserver
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-16 bg-cream">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-serif text-sage mb-6">
              {content.additionalInfo.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              {content.additionalInfo.items.map((item, index) => (
                <div key={index}>
                  <h3 className="font-medium text-sage mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}