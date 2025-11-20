import Link from 'next/link';

import type { HomeCtaSection } from '@/lib/content/defaults';
import { DEFAULT_CONTENT } from '@/lib/content/defaults';

interface CtaProps {
  content?: HomeCtaSection;
}

const Cta = ({ content }: CtaProps) => {
  const data = content ?? DEFAULT_CONTENT.home_page.cta;

  return (
    <section className="py-20 bg-sage">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
          {data.title}
        </h2>
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
          {data.text}
        </p>
        <Link
          href={data.buttonHref}
          className="inline-block bg-gold hover:bg-cream hover:text-sage text-white px-8 py-4 rounded-full text-lg transition-all duration-300"
        >
          {data.buttonLabel}
        </Link>
      </div>
    </section>
  );
};

export default Cta;