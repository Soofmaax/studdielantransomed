'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <h2 className="text-2xl font-serif text-sage mb-4">Une erreur est survenue</h2>
        <p className="text-gray-600 mb-6">
          Nous nous excusons pour ce désagrément. Notre équipe a été notifiée.
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="bg-sage text-white px-6 py-2 rounded-full hover:bg-gold transition-colors"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="inline-block bg-white text-sage px-6 py-2 rounded-full hover:bg-gray-50 transition-colors"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}