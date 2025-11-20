import Image from 'next/image';
import Link from 'next/link';

import About from '@/components/sections/About';
import Cta from '@/components/sections/Cta';
import Services from '@/components/sections/Services';
import Testimonials from '@/components/sections/Testimonials';
import { getHomePageContent } from '@/lib/content/server';

export default async function Home() {
  const content = await getHomePageContent();

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src={content.hero.backgroundImageUrl}
            alt=""
            fill
            className="object-cover pointer-events-none"
            priority
          />
          <div className="absolute inset-0 bg-black/40 pointer-events-none" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-serif mb-6">
            {content.hero.title}
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            {content.hero.subtitle}
          </p>
          <Link
            href={content.hero.ctaHref}
            className="inline-block bg-sage hover:bg-gold text-white px-8 py-4 rounded-full text-lg transition-colors duration-300"
            data-testid="home-cta-reserver"
          >
            {content.hero.ctaLabel}
          </Link>
        </div>
      </section>

      <About content={content.about} />
      <Services content={content.servicesSection} />
      <Testimonials content={content.testimonialsSection} />
      <Cta content={content.cta} />
    </>
  );
}