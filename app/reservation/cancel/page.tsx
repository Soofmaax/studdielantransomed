'use client';

import Link from 'next/link';

export default function ReservationCancelPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        <h1 className="text-3xl font-serif text-red-700 mb-4">Paiement annulé</h1>
        <p className="text-gray-700 mb-4">
          Votre paiement a été annulé. Vous pouvez sélectionner un autre créneau ou réessayer plus tard.
        </p>

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