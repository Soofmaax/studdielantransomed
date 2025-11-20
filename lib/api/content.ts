import { logger } from '@/lib/logger';
import { DEFAULT_CONTENT } from '@/lib/content/defaults';
import type { ContentKey, ContentMap } from '@/lib/content/defaults';

// Fallback local API route to avoid undefined base URL during builds/tests
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

type ContentData<K extends ContentKey> = ContentMap[K];

export async function fetchContent<K extends ContentKey>(key: K): Promise<ContentData<K>> {
  try {
    const response = await fetch(`${API_URL}/content/${key}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      // Si le contenu n'existe pas encore, on retourne simplement les valeurs par défaut
      if (response.status === 404) {
        return DEFAULT_CONTENT[key];
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    return (json.data ?? DEFAULT_CONTENT[key]) as ContentData<K>;
  } catch (error) {
    logger.error('Failed to fetch content:', error);
    throw new Error("Une erreur est survenue lors du chargement du contenu");
  }
}

export async function updateContent<K extends ContentKey>(
  key: K,
  data: ContentData<K>
): Promise<ContentData<K>> {
  try {
    const response = await fetch(`${API_URL}/content/${key}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json = await response.json();
    return json.data as ContentData<K>;
  } catch (error) {
    logger.error('Failed to update content:', error);
    throw new Error("Une erreur est survenue lors de la mise à jour du contenu");
  }
}