'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar } from 'react-big-calendar';
import { useAuth } from '@/lib/AuthProvider';
import { useBookings } from '@/hooks/use-bookings';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from '@/components/ui/toast';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function ReservationPage() {
  const { user } = useAuth();
  const { bookings, isLoading, error } = useBookings();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const { handleSubmit } = useForm();

  const handleBooking = async () => {
    try {
      const stripe = await stripePromise;
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: selectedSlot.courseId,
          date: selectedSlot.start,
          userId: user.id,
        }),
      });

      const session = await response.json();
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la réservation',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Une erreur est survenue lors du chargement des réservations
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif text-sage mb-8">Réserver un cours</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Calendar
          localizer={localizer}
          events={bookings}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          onSelectSlot={setSelectedSlot}
          selectable
        />

        {selectedSlot && (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-serif text-sage mb-4">Détails de la réservation</h2>
            <form onSubmit={handleSubmit(handleBooking)} className="space-y-4">
              <button
                type="submit"
                className="w-full bg-sage hover:bg-gold text-white py-2 px-4 rounded-md transition-colors duration-300"
              >
                Procéder au paiement
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}