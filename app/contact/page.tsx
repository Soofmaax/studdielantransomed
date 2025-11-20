import ContactForm from '@/components/contact/ContactForm';
import { getContactPageContent } from '@/lib/content/server';

export default async function ContactPage() {
  const content = await getContactPageContent();

  return (
    <div className="pt-24">
      {/* Contact Info */}
      <section className="bg-cream py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif text-sage text-center mb-8">
            {content.hero.title}
          </h1>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-gray-600">
              {content.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ContactForm />

            {/* Contact Information */}
            <div>
              <div className="bg-cream rounded-lg p-8 mb-8">
                <h3 className="text-xl font-serif text-sage mb-4">
                  {content.contactInfo.title}
                </h3>
                <div className="space-y-4 text-gray-600">
                  {content.contactInfo.lines.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>

              <div className="bg-cream rounded-lg p-8">
                <h3 className="text-xl font-serif text-sage mb-4">
                  {content.openingHours.title}
                </h3>
                <div className="space-y-2 text-gray-600">
                  {content.openingHours.lines.map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">
                  {content.mapPlaceholderText}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
