'use client';

import { useState } from 'react';
import { toast } from '@/components/ui/toast';
import { logger } from '@/lib/logger';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Handle form submission
      await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      toast({
        title: 'Succès',
        description: 'Votre message a été envoyé',
        variant: 'success',
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      logger.error('Contact form submission failed:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'envoi du message',
        variant: 'destructive',
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="pt-24">
      {/* Contact Info */}
      <section className="bg-cream py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-serif text-sage text-center mb-8">
            Contactez-nous
          </h1>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-gray-600">
              Une question ? Nous sommes là pour vous répondre.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-serif text-sage mb-6">Envoyez-nous un message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-gray-700 mb-2">Sujet</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
                    required
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="information">Demande d'information</option>
                    <option value="reservation">Réservation</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage focus:border-sage"
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-sage hover:bg-gold text-white py-3 px-6 rounded-full transition-colors duration-300"
                >
                  Envoyer
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div>
              <div className="bg-cream rounded-lg p-8 mb-8">
                <h3 className="text-xl font-serif text-sage mb-4">Coordonnées</h3>
                <div className="space-y-4 text-gray-600">
                  <p>123 Avenue des Champs-Élysées</p>
                  <p>75008 Paris</p>
                  <p>Téléphone: 01 23 45 67 89</p>
                  <p>Email: contact@studio-elan.fr</p>
                </div>
              </div>

              <div className="bg-cream rounded-lg p-8">
                <h3 className="text-xl font-serif text-sage mb-4">Horaires d'ouverture</h3>
                <div className="space-y-2 text-gray-600">
                  <p>Lundi - Vendredi: 8h - 21h</p>
                  <p>Samedi: 9h - 18h</p>
                  <p>Dimanche: 9h - 16h</p>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-8 bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Carte interactive</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}