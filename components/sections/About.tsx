import Image from 'next/image';

import type { HomeAboutContent } from '@/lib/content/defaults';
import { DEFAULT_CONTENT } from '@/lib/content/defaults';

interface AboutProps {
  content?: HomeAboutContent;
}

const About = ({ content }: AboutProps) => {
  const data = content ?? DEFAULT_CONTENT.home_page.about;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-[500px]">
            <Image
              src={data.imageUrl}
              alt="Studio de yoga"
              fill
              className="object-cover rounded-lg pointer-events-none"
            />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-sage mb-6">{data.title}</h2>
            {data.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-gray-600 mb-6 leading-relaxed">
                {paragraph}
              </p>
            ))}
            <div className="grid grid-cols-3 gap-4 text-center">
              {data.stats.map((stat, index) => (
                <div key={index} className="p-4 bg-cream rounded-lg">
                  <p className="text-2xl font-serif text-gold mb-2">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;