import { BUSINESS_CONFIG } from '@/lib/content/business-config';

interface LocalBusinessJsonLd {
  '@context': 'https://schema.org';
  '@type': 'LocalBusiness';
  name: string;
  image?: string;
  description: string;
  telephone: string;
  url: string;
  address: {
    '@type': 'PostalAddress';
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    '@type': 'GeoCoordinates';
    latitude: number;
    longitude: number;
  };
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification';
    dayOfWeek: string[];
    opens: string;
    closes: string;
  }[];
  priceRange: string;
  currenciesAccepted: string;
  sameAs?: string[];
}

/**
 * Construit le JSON-LD LocalBusiness à partir de BUSINESS_CONFIG.
 * Ce format est compatible avec les rich snippets Google pour les commerces locaux.
 */
export function getLocalBusinessJsonLd(): LocalBusinessJsonLd {
  const { address, geo, openingHours, social, seo, name } = BUSINESS_CONFIG;

  const openingHoursSpecification = openingHours.map((spec) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: spec.days,
    opens: spec.opens,
    closes: spec.closes,
  }));

  const sameAs: string[] = [
    social.instagram,
    social.facebook,
    social.youtube,
    social.twitter,
    social.linkedin,
  ].filter((url): url is string => typeof url === 'string' && url.length > 0);

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    image: seo.ogImageUrl,
    description: seo.defaultDescription,
    telephone: BUSINESS_CONFIG.phone,
    url: seo.siteUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.streetAddress,
      addressLocality: address.city,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo.latitude,
      longitude: geo.longitude,
    },
    openingHoursSpecification,
    priceRange: BUSINESS_CONFIG.priceRange,
    currenciesAccepted: BUSINESS_CONFIG.currenciesAccepted,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}