'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ReservationSuccessPage() {
  const search = useSearchParams();
  const sessionId = search.get('session_id');
  const isDemo = search.get('demo') === '1';

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        <h1 className="text-3xl font-serif text-sage mb-4">Réservation confirmée</h1>
        <p className="text-gray-700 mb-2">
          Merci pour votre réservation. Vous allez recevoir un email de confirmation.
        </p>

        {isDemo && (
          <p className="text-amber-700 bg-amber-50 border border-amber-200 rounded p-3 my-4">
            Mode démo: cette confirmation a été simulée sans paiement réel.
          </p>
        )}

        {sessionId && (
          <p className="text-sm text-gray-500 mb-4">Session: {sessionId}</p>
        )}

        <div className="flex justify-center gap-3 mt-6">
          <Link
            href="/reservation"
            className="inline-block bg-sage hover:bg-gold text-white py-2 px-4 rounded-md transition-colors duration-300"
          >
            Retour aux réservations
          </Link>
          <Link
            href="/"
            className="inline-block bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-md transition-colors duration-300"
          >
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}