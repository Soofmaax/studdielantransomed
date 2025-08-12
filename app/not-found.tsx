import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center">
        <h2 className="text-4xl font-serif text-sage mb-4">404</h2>
        <p className="text-xl text-gray-600 mb-6">
          La page que vous recherchez n'existe pas.
        </p>
        <Link
          href="/"
          className="inline-block bg-sage text-white px-6 py-2 rounded-full hover:bg-gold transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}