import Link from 'next/link';

const Cta = () => {
  return (
    <section className="py-20 bg-sage">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
          Prêt à rejoindre Studio Élan ?
        </h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          Commencez votre voyage vers le bien-être aujourd'hui. Premier cours d'essai à 15€.
        </p>
        <Link
          href="/reservation"
          className="inline-block bg-gold hover:bg-cream hover:text-sage text-white px-8 py-4 rounded-full text-lg transition-all duration-300"
        >
          Réserver maintenant
        </Link>
      </div>
    </section>
  );
};

export default Cta;