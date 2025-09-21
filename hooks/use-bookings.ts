
// dans hooks/use-bookings.ts

import { useEffect, useState } from 'react';

import api from '@/lib/api';
import { IBookingWithRelations } from '@/types/api'; // On importe votre type existant

export function useBookings() {
  // On dit à TypeScript que 'bookings' sera un tableau de IBookingWithRelations
  const [bookings, setBookings] = useState<IBookingWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/bookings');
        // On s'assure que les données reçues correspondent au type
        setBookings(response.data as IBookingWithRelations[]);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return { bookings, isLoading, error };
}
