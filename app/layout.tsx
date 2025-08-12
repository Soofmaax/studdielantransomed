import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/lib/AuthProvider';
import { Analytics } from '@/components/Analytics';
import { Providers } from '@/components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: {
    default: 'Studio Élan | Yoga & Bien-être à Paris',
    template: '%s | Studio Élan'
  },
  description: 'Studio de yoga premium au cœur de Paris. Cours collectifs et particuliers, méditation et bien-être.',
  keywords: ['yoga', 'méditation', 'bien-être', 'paris', 'cours de yoga', 'studio de yoga'],
  authors: [{ name: 'Studio Élan' }],
  creator: 'Studio Élan',
  manifest: '/manifest.json',
  themeColor: '#B2C2B1',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://studio-elan.fr',
    siteName: 'Studio Élan',
    title: 'Studio Élan | Yoga & Bien-être à Paris',
    description: 'Studio de yoga premium au cœur de Paris. Cours collectifs et particuliers, méditation et bien-être.',
    images: [
      {
        url: 'https://images.pexels.com/photos/6698513/pexels-photo-6698513.jpeg',
        width: 1200,
        height: 630,
        alt: 'Studio Élan - Yoga & Bien-être à Paris'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Studio Élan | Yoga & Bien-être à Paris',
    description: 'Studio de yoga premium au cœur de Paris. Cours collectifs et particuliers, méditation et bien-être.',
    images: ['https://images.pexels.com/photos/6698513/pexels-photo-6698513.jpeg']
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <head />
      <body className="min-h-screen bg-cream flex flex-col">
        <Providers>
          <AuthProvider>
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}