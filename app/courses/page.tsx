import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

import { BUSINESS_CONFIG } from '@/lib/content/business-config';
import { YOGA_COURSES_PAGE_CONFIG } from '@/lib/content/yoga-studio-content';

export const metadata: Metadata = {
  title: BUSINESS_CONFIG.seo.pages.courses.title,
  description: BUSINESS_CONFIG.seo.pages.courses.description,
};

export default function CoursesPage() {
  const { hero, intro, courses } = YOGA_COURSES_PAGE_CONFIG;

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="bg-cream py-16">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif text-sage mb-6">
            {hero.title}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {hero.subtitle}
          </p>
        </div>
      </section>

      {/* Intro + Courses Grid */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <p className="text-gray-600">
              {intro}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg overflow-hidden shadow-lg flex flex-col"
              >
                <div className="relative h-64">
                  <Image
                    src={course.imageUrl}
                    alt={course.title}
                    fill
                    className="object-cover pointer-events-none"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-serif text-sage">
                      {course.title}
                    </h3>
                    <span className="text-gold font-medium">
                      {course.price}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4 flex-1">
                    {course.description}
                  </p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Durée: {course.duration}</span>
                    <span>Niveau: {course.level}</span>
                  </div>
                  <Link
                    href="/reservation"
                    className="mt-6 inline-block text-center bg-sage hover:bg-gold text-white py-3 px-6 rounded-full transition-colors duration-300"
                  >
                    Réserver ce cours
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}