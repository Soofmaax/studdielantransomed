import Image from 'next/image';

import type { HomeTestimonialsSection } from '@/lib/content/defaults';
import { DEFAULT_CONTENT } from '@/lib/content/defaults';

interface TestimonialsProps {
  content?: HomeTestimonialsSection;
}

const Testimonials = ({ content }: TestimonialsProps) => {
  const section = content ?? DEFAULT_CONTENT.home_page.testimonialsSection;
  const testimonials = section.testimonials;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-serif text-sage text-center mb-12">
          {section.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-cream rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="relative w-12 h-12 mr-4">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="rounded-full object-cover pointer-events-none"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-medium text-sage">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-600 italic">&ldquo;{testimonial.content}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;