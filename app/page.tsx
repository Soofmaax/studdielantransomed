import About from '@/components/sections/About';
import Services from '@/components/sections/Services';
import Testimonials from '@/components/sections/Testimonials';
import Cta from '@/components/sections/Cta';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/6698513/pexels-photo-6698513.jpeg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-serif mb-6">
            Trouvez votre équilibre intérieur
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Le yoga n'est pas une simple pratique — c'est un voyage de reconnexion à votre essence véritable.
          </p>
          <Link
            href="/reservation"
            className="inline-block bg-sage hover:bg-gold text-white px-8 py-4 rounded-full text-lg transition-colors duration-300"
          >
            Réserver une séance
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