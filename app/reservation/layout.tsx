import type { Metadata } from 'next';

import { BUSINESS_CONFIG } from '@/lib/content/business-config';

export const metadata: Metadata = {
  title: BUSINESS_CONFIG.seo.pages.reservation.title,
  description: BUSINESS_CONFIG.seo.pages.reservation.description,
};

export default function ReservationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}