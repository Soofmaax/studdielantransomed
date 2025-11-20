import { Inter, Playfair_Display } from 'next/font/google';
import { headers } from 'next/headers';

import { Analytics } from '@/components/Analytics';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { Providers } from '@/components/Providers';
import { AuthProvider } from '@/lib/AuthProvider';
import { BUSINESS_CONFIG } from '@/lib/content/business-config';
import { getLocalBusinessJsonLd } from '@/lib/seo/local-business-jsonld';
import { initSentry } from '@/lib/sentry';

import './globals.css';

import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

initSentry();

export const metadata: Metadata = {
  title: {
    default: BUSINESS_CONFIG.seo.defaultTitle,
    template: BUSINESS_CONFIG.seo.titleTemplate,
  },
  description: BUSINESS_CONFIG.seo.defaultDescription,
  keywords: BUSINESS_CONFIG.seo.keywords,
  authors: [{ name: BUSINESS_CONFIG.name }],
  creator: BUSINESS_CONFIG.name,
  manifest: '/manifest.json',
  themeColor: '#B2C2B1',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: BUSINESS_CONFIG.seo.siteUrl,
    siteName: BUSINESS_CONFIG.seo.siteName,
    title: BUSINESS_CONFIG.seo.defaultTitle,
    description: BUSINESS_CONFIG.seo.defaultDescription,
    images: [
      {
        url: BUSINESS_CONFIG.seo.ogImageUrl,
        width: 1200,
        height: 630,
        alt: `${BUSINESS_CONFIG.name} - Yoga & Bien-être à Paris`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: BUSINESS_CONFIG.seo.defaultTitle,
    description: BUSINESS_CONFIG.seo.defaultDescription,
    images: [BUSINESS_CONFIG.seo.twitterImageUrl],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusinessJsonLd = getLocalBusinessJsonLd();

  return (
    <html lang="fr" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
      </head>
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
        <Analytics nonce={headers().get('x-nonce') ?? undefined} />
      </body>
    </html>
  );
}