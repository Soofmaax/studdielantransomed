'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { fr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { useAuth } from '@/lib/AuthProvider';
import { useBookings } from '@/hooks/use-bookings';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from '@/components/ui/toast';
import { loadStripe } from '@stripe/stripe-js';

// Configuration du localizer pour date-fns
const locales = {
  'fr': fr,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Définition d'un type pour les événements du calendrier
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: any; // Vous pouvez typer plus précisément si nécessaire
}

// Définition d'un type pour le créneau sélectionné
interface SelectedSlot {
  start: Date;
  end: Date;
  slots: Date[];
  action: 'select' | 'click' | 'doubleClick';
  resource?: any; // Contient les données du cours si vous les attachez
}

export default function ReservationPage() {
  const { user } = useAuth();
  const { bookings, isLoading, error } = useBookings();
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const { handleSubmit } = useForm();

  const handleBooking = async () => {
    // ====================================================================
    // == CORRECTION APPLIQUÉE ICI ==
    // On vérifie que 'user' et 'selectedSlot' ne sont pas null
    // avant de tenter d'accéder à leurs propriétés.
    // ====================================================================
    if (!user || !selectedSlot) {
      toast({
        title: 'Erreur',
        description: 'Veuillez vous connecter et sélectionner un créneau.',
        variant: 'destructive',
      });
      return;
    }
    
    // On vérifie que le créneau sélectionné a bien les informations du cours
    if (!selectedSlot.resource?.id) {
        toast({
            title: 'Erreur',
            description: 'Les informations du cours sont manquantes pour ce créneau.',
            variant: 'destructive',
        });
        return;
    }

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe.js n\'a pas pu être chargé.');
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedSlot.resource.id, // On utilise selectedSlot.resource.id
          date: selectedSlot.start.toISOString(),
          userId: user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'La création de la session de paiement a échoué.');
      }

      const session = await response.json();
      
      // La session contient maintenant un champ 'url'
      if (session.data && session.data.url) {
        window.location.href = session.data.url;
      } else {
        throw new Error('URL de redirection Stripe manquante.');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur inconnue est survenue.';
      toast({
        title: 'Erreur de réservation',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner className="h-12 w-12" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          Une erreur est survenue lors du chargement des réservations.
        </div>
      </div>
    );
  }

  // Transformation des réservations en événements pour le calendrier
  const events: CalendarEvent[] = bookings.map(booking => ({
    id: booking.id,
    title: booking.course.title,
    start: new Date(booking.date),
    end: new Date(new Date(booking.date).getTime() + booking.course.duration * 60000),
    resource: { id: booking.courseId },
  }));

  return (
    <div className="container mx-auto px-4 py-24">
      <h1 className="text-3xl font-serif text-sage mb-8">Réserver un cours</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            onSelectEvent={event => {
              // Simuler la sélection d'un créneau quand on clique sur un événement
              setSelectedSlot({
                start: event.start,
                end: event.end,
                slots: [event.start],
                action: 'click',
                resource: event.resource,
              });
            }}
            selectable
            culture='fr'
            messages={{
              next: "Suivant",
              previous: "Précédent",
              today: "Aujourd'hui",
              month: "Mois",
              week: "Semaine",
              day: "Jour",
              agenda: "Agenda",
              date: "Date",
              time: "Heure",
              event: "Événement",
            }}
          />
        </div>

        <div className="lg:col-span-1">
          {selectedSlot ? (
            <div className="bg-white p-6 rounded-lg shadow-lg sticky top-24">
              <h2 className="text-xl font-serif text-sage mb-4">Détails de la réservation</h2>
              <p><strong>Date:</strong> {format(selectedSlot.start, 'dd/MM/yyyy', { locale: fr })}</p>
              <p><strong>Heure:</strong> {format(selectedSlot.start, 'HH:mm', { locale: fr })}</p>
              <form onSubmit={handleSubmit(handleBooking)} className="space-y-4 mt-4">
                <button
                  type="submit"
                  className="w-full bg-sage hover:bg-gold text-white py-2 px-4 rounded-md transition-colors duration-300"
                >
                  Procéder au paiement
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-cream p-6 rounded-lg text-center">
              <p className="text-gray-600">Veuillez sélectionner un créneau dans le calendrier pour commencer votre réservation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
