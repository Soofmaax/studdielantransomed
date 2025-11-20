import db from '@/lib/prisma';

import { DEFAULT_CONTENT } from './defaults';
import type { ContentKey, ContentMap } from './defaults';

/**
 * Récupère le contenu d'une page.
 * Si aucun contenu personnalisé n'est trouvé en base, on renvoie les valeurs par défaut.
 */
export async function getContent<K extends ContentKey>(key: K): Promise<ContentMap[K]> {
  const block = await db.contentBlock.findUnique({
    where: { key },
  });

  if (!block || block.data == null) {
    return DEFAULT_CONTENT[key];
  }

  return block.data as ContentMap[K];
}

export async function getHomePageContent() {
  return getContent('home_page');
}

export async function getAboutPageContent() {
  return getContent('about_page');
}

export async function getServicesPageContent() {
  return getContent('services_page');
}

export async function getContactPageContent() {
  return getContent('contact_page');
}