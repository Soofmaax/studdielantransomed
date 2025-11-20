import Image from 'next/image';
import type { Metadata } from 'next';

import { BUSINESS_CONFIG } from '@/lib/content/business-config';
import { getAboutPageContent } from '@/lib/content/server';

export const metadata: Metadata = {
  title: BUSINESS_CONFIG.seo.pages.about.title,
  description: BUSINESS_CONFIG.seo.pages.about.description,
};

export default async function AboutPage() {
  const content = await getAboutPageContent();

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="bg-cream py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif text-sage text-center mb-8">
            {content.hero.title}
          </h1>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-gray-600 mb-8">
              {content.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div className="relative h-[600px]">
              <Image
                src={content.mainSection.imageUrl}
                alt="Studio de yoga"
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-serif text-sage mb-6">
                {content.mainSection.title}
              </h2>
              {content.mainSection.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-gray-600 mb-6 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Philosophy Section */}
          <div className="bg-cream rounded-lg p-12 mt-16">
            <h2 className="text-3xl font-serif text-sage text-center mb-12">
              {content.philosophySection.title}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {content.philosophySection.items.map((item, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-serif text-sage mb-4">{item.title}</h3>
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