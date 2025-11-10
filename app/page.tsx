import Image from 'next/image';
import Link from 'next/link';

import About from '@/components/sections/About';
import Cta from '@/components/sections/Cta';
import Services from '@/components/sections/Services';
import Testimonials from '@/components/sections/Testimonials';

export default function Home() {
  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.pexels.com/photos/6698513/pexels-photo-6698513.jpeg"
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
            Trouvez votre équilibre intérieur
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Le yoga n&apos;est pas une simple pratique — c&apos;est un voyage de reconnexion à votre essence véritable.
          </p>
          <Link
            href="/reservation"
            className="inline-block bg-sage hover:bg-gold text-white px-8 py-4 rounded-full text-lg transition-colors duration-300"
            data-testid="home-cta-reserver"
          >
            Réserver
          </Link>
        </div>
      </section>

      <About />
      <Services />
      <Testimonials />
      <Cta />
    </>
  );
}