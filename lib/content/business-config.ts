import { YOGA_COURSES_PAGE_CONFIG } from '@/lib/content/yoga-studio-content';

export type OpeningDay =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface BusinessAddress {
  streetAddress: string;
  postalCode: string;
  city: string;
  region: string;
  countryCode: string;
}

export interface BusinessGeo {
  latitude: number;
  longitude: number;
}

export interface OpeningHoursSpec {
  days: OpeningDay[];
  opens: string; // HH:MM
  closes: string; // HH:MM
}

export interface BusinessSocialLinks {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  twitter?: string;
  linkedin?: string;
}

export interface SeoPageMetadata {
  title: string;
  description: string;
}

export interface BusinessSeoConfig {
  siteName: string;
  siteUrl: string;
  defaultTitle: string;
  defaultDescription: string;
  titleTemplate: string;
  keywords: string[];
  ogImageUrl: string;
  twitterImageUrl: string;
  pages: {
    home: SeoPageMetadata;
    about: SeoPageMetadata;
    services: SeoPageMetadata;
    contact: SeoPageMetadata;
    courses: SeoPageMetadata;
    reservation: SeoPageMetadata;
  };
}

export interface BusinessConfig {
  name: string;
  tagline: string;
  phone: string;
  email: string;
  address: BusinessAddress;
  geo: BusinessGeo;
  openingHours: OpeningHoursSpec[];
  priceRange: string;
  currenciesAccepted: string;
  social: BusinessSocialLinks;
  seo: BusinessSeoConfig;
}

export const BUSINESS_CONFIG: BusinessConfig = {
  name: 'Studio Élan',
  tagline: 'Studio de yoga et méditation à Paris',
  phone: '+33123456789',
  email: 'contact@studio-elan.fr',
  address: {
    streetAddress: '123 Avenue des Champs-Élysées',
    postalCode: '75008',
    city: 'Paris',
    region: 'Île-de-France',
    countryCode: 'FR',
  },
  geo: {
    latitude: 48.8698,
    longitude: 2.3075,
  },
  openingHours: [
    {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '21:00',
    },
    {
      days: ['Saturday', 'Sunday'],
      opens: '09:00',
      closes: '18:00',
    },
  ],
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  social: {
    instagram: 'https://instagram.com/studio-elan',
    facebook: 'https://facebook.com/studio-elan',
    youtube: 'https://youtube.com/',
    twitter: 'https://twitter.com/',
    linkedin: 'https://linkedin.com/',
  },
  seo: {
    siteName: 'Studio Élan',
    siteUrl: 'https://studio-elan.fr',
    defaultTitle: 'Studio Élan | Yoga & Bien-être à Paris',
    defaultDescription:
      'Studio de yoga premium au cœur de Paris. Cours collectifs et particuliers, méditation et bien-être.',
    titleTemplate: '%s | Studio Élan',
    keywords: [
      'yoga',
      'méditation',
      'bien-être',
      'paris',
      'cours de yoga',
      'studio de yoga',
    ],
    ogImageUrl:
      'https://images.pexels.com/photos/6698513/pexels-photo-6698513.jpeg',
    twitterImageUrl:
      'https://images.pexels.com/photos/6698513/pexels-photo-6698513.jpeg',
    pages: {
      home: {
        title: 'Cours de yoga à Paris – Studio Élan',
        description:
          "Studio Élan propose des cours de yoga et méditation adaptés à tous les niveaux dans un espace calme et lumineux au cœur de Paris.",
      },
      about: {
        title: 'À propos du Studio Élan',
        description:
          "Découvrez l’histoire, la vision et la philosophie du Studio Élan, un espace dédié au bien-être et à la reconnexion à soi.",
      },
      services: {
        title: 'Nos services et formules de yoga',
        description:
          'Découvrez tous les services proposés par le Studio Élan : cours collectifs, séances individuelles, ateliers et programmes bien-être.',
      },
      contact: {
        title: 'Contact & accès – Studio Élan',
        description:
          'Contactez le Studio Élan pour toute question ou réservation, et retrouvez toutes les informations pratiques (adresse, téléphone, horaires).',
      },
      courses: {
        title: YOGA_COURSES_PAGE_CONFIG.seo.title,
        description: YOGA_COURSES_PAGE_CONFIG.seo.description,
      },
      reservation: {
        title: 'Réservation de cours de yoga',
        description:
          'Réservez votre cours de yoga ou de méditation en ligne au Studio Élan. Choisissez votre créneau et réglez en toute sécurité.',
      },
    },
  },
};