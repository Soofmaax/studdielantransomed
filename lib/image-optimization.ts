/**
 * Utilitaire d'optimisation d'images - Approche artisanale
 * Performance maximale avec formats modernes et responsive design
 */

/**
 * Configuration des tailles d'images responsive
 */
export const IMAGE_SIZES = {
  // Tailles pour les images hero/bannières
  hero: {
    mobile: 640,
    tablet: 1024,
    desktop: 1920,
    ultrawide: 2560,
  },
  // Tailles pour les cartes de contenu
  card: {
    thumbnail: 300,
    small: 400,
    medium: 600,
    large: 800,
  },
  // Tailles pour les avatars/profils
  avatar: {
    small: 40,
    medium: 80,
    large: 120,
    xlarge: 200,
  },
  // Tailles pour les galeries
  gallery: {
    thumbnail: 200,
    preview: 400,
    full: 1200,
  },
} as const;

/**
 * Configuration des formats d'images supportés
 */
export const IMAGE_FORMATS = {
  webp: 'webp',
  avif: 'avif',
  jpeg: 'jpeg',
  png: 'png',
} as const;

/**
 * Configuration de qualité par format
 */
export const IMAGE_QUALITY = {
  avif: 50,    // AVIF permet une qualité élevée avec une taille réduite
  webp: 75,    // WebP offre un bon compromis qualité/taille
  jpeg: 85,    // JPEG pour la compatibilité
  png: 100,    // PNG pour les images avec transparence
} as const;

/**
 * Interface pour les métadonnées d'image
 */
export interface IImageMetadata {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * Interface pour les sources d'images responsive
 */
export interface IImageSource {
  src: string;
  srcSet: string;
  type: string;
  sizes: string;
}

/**
 * Service d'optimisation d'images avec approche artisanale
 */
export class ImageOptimizationService {
  /**
   * Génère les URLs d'images optimisées pour différents formats et tailles
   * @param basePath - Chemin de base de l'image
   * @param sizes - Tailles à générer
   * @returns Sources d'images optimisées
   */
  static generateResponsiveSources(
    basePath: string,
    sizes: Record<string, number>
  ): IImageSource[] {
    const sources: IImageSource[] = [];

    // Génération des sources AVIF (format le plus optimisé)
    if (this.supportsFormat('avif')) {
      sources.push({
        src: this.getOptimizedImageUrl(basePath, 'avif', sizes.desktop),
        srcSet: this.generateSrcSet(basePath, 'avif', sizes),
        type: 'image/avif',
        sizes: this.generateSizesAttribute(sizes),
      });
    }

    // Génération des sources WebP (fallback moderne)
    sources.push({
      src: this.getOptimizedImageUrl(basePath, 'webp', sizes.desktop),
      srcSet: this.generateSrcSet(basePath, 'webp', sizes),
      type: 'image/webp',
      sizes: this.generateSizesAttribute(sizes),
    });

    // Génération des sources JPEG (fallback universel)
    sources.push({
      src: this.getOptimizedImageUrl(basePath, 'jpeg', sizes.desktop),
      srcSet: this.generateSrcSet(basePath, 'jpeg', sizes),
      type: 'image/jpeg',
      sizes: this.generateSizesAttribute(sizes),
    });

    return sources;
  }

  /**
   * Génère l'URL d'une image optimisée
   * @param basePath - Chemin de base
   * @param format - Format d'image
   * @param width - Largeur
   * @returns URL optimisée
   */
  static getOptimizedImageUrl(
    basePath: string,
    format: keyof typeof IMAGE_FORMATS,
    width: number
  ): string {
    const quality = IMAGE_QUALITY[format];
    return `/_next/image?url=${encodeURIComponent(basePath)}&w=${width}&q=${quality}&fm=${format}`;
  }

  /**
   * Génère un srcSet pour un format donné
   * @param basePath - Chemin de base
   * @param format - Format d'image
   * @param sizes - Tailles disponibles
   * @returns SrcSet string
   */
  static generateSrcSet(
    basePath: string,
    format: keyof typeof IMAGE_FORMATS,
    sizes: Record<string, number>
  ): string {
    return Object.values(sizes)
      .map(width => `${this.getOptimizedImageUrl(basePath, format, width)} ${width}w`)
      .join(', ');
  }

  /**
   * Génère l'attribut sizes pour le responsive design
   * @param sizes - Configuration des tailles
   * @returns Attribut sizes
   */
  static generateSizesAttribute(sizes: Record<string, number>): string {
    const breakpoints = [
      `(max-width: 640px) ${sizes.mobile || sizes.small || Object.values(sizes)[0]}px`,
      `(max-width: 1024px) ${sizes.tablet || sizes.medium || Object.values(sizes)[1]}px`,
      `${sizes.desktop || sizes.large || Object.values(sizes)[2] || Object.values(sizes)[0]}px`,
    ];

    return breakpoints.join(', ');
  }

  /**
   * Vérifie si un format d'image est supporté par le navigateur
   * @param format - Format à vérifier
   * @returns true si supporté
   */
  static supportsFormat(format: keyof typeof IMAGE_FORMATS): boolean {
    if (typeof window === 'undefined') return true; // SSR

    // Détection des formats supportés
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;

    switch (format) {
      case 'avif':
        return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
      case 'webp':
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
      default:
        return true;
    }
  }

  /**
   * Génère un placeholder blur pour le chargement progressif
   * @param width - Largeur de l'image
   * @param height - Hauteur de l'image
   * @param color - Couleur dominante (optionnel)
   * @returns Data URL du placeholder
   */
  static generateBlurPlaceholder(
    width: number,
    height: number,
    color = '#f3f4f6'
  ): string {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:${color};stop-opacity:0.4" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
      </svg>
    `;

    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  }

  /**
   * Calcule le ratio d'aspect d'une image
   * @param width - Largeur
   * @param height - Hauteur
   * @returns Ratio d'aspect
   */
  static calculateAspectRatio(width: number, height: number): number {
    return width / height;
  }

  /**
   * Génère les métadonnées complètes pour une image
   * @param config - Configuration de l'image
   * @returns Métadonnées complètes
   */
  static generateImageMetadata(config: {
    src: string;
    alt: string;
    width: number;
    height: number;
    priority?: boolean;
    category?: keyof typeof IMAGE_SIZES;
  }): IImageMetadata {
    const { src, alt, width, height, priority = false, category = 'card' } = config;

    return {
      src,
      alt,
      width,
      height,
      priority,
      blurDataURL: this.generateBlurPlaceholder(width, height),
      sizes: this.generateSizesAttribute(IMAGE_SIZES[category]),
    };
  }
}

/**
 * Configuration des images du site Studio Élan
 */
export const STUDIO_IMAGES = {
  hero: {
    main: '/images/hero/yoga-studio-main.webp',
    alt: 'Studio de yoga serein avec lumière naturelle et équipements professionnels',
    width: 1920,
    height: 1080,
    priority: true,
  },
  about: {
    instructor: '/images/about/instructor-portrait.webp',
    alt: 'Portrait professionnel de l\'instructrice de yoga dans le studio',
    width: 800,
    height: 1000,
  },
  services: [
    {
      id: 'hatha-yoga',
      src: '/images/services/hatha-yoga.webp',
      alt: 'Séance de Hatha Yoga dans un environnement paisible',
      width: 600,
      height: 400,
    },
    {
      id: 'vinyasa-flow',
      src: '/images/services/vinyasa-flow.webp',
      alt: 'Cours de Vinyasa Flow dynamique avec mouvements fluides',
      width: 600,
      height: 400,
    },
    {
      id: 'meditation',
      src: '/images/services/meditation.webp',
      alt: 'Séance de méditation guidée dans un espace zen',
      width: 600,
      height: 400,
    },
  ],
  testimonials: {
    background: '/images/testimonials/peaceful-background.webp',
    alt: 'Arrière-plan paisible pour les témoignages clients',
    width: 1200,
    height: 600,
  },
} as const;

/**
 * Utilitaires pour les images du studio
 */
export class StudioImageUtils {
  /**
   * Obtient les métadonnées d'une image du studio
   * @param imageKey - Clé de l'image dans STUDIO_IMAGES
   * @returns Métadonnées de l'image
   */
  static getImageMetadata(imageKey: string): IImageMetadata | null {
    // Navigation dans l'objet STUDIO_IMAGES pour trouver l'image
    const findImage = (obj: any, key: string): any => {
      if (obj[key]) return obj[key];
      
      for (const value of Object.values(obj)) {
        if (Array.isArray(value)) {
          const found = value.find((item: any) => item.id === key);
          if (found) return found;
        } else if (typeof value === 'object' && value !== null) {
          const found = findImage(value, key);
          if (found) return found;
        }
      }
      return null;
    };

    const imageConfig = findImage(STUDIO_IMAGES, imageKey);
    if (!imageConfig) return null;

    return ImageOptimizationService.generateImageMetadata(imageConfig);
  }

  /**
   * Génère les sources responsive pour une image du studio
   * @param imageKey - Clé de l'image
   * @param category - Catégorie de tailles
   * @returns Sources responsive
   */
  static getResponsiveSources(
    imageKey: string,
    category: keyof typeof IMAGE_SIZES = 'card'
  ): IImageSource[] {
    const metadata = this.getImageMetadata(imageKey);
    if (!metadata) return [];

    return ImageOptimizationService.generateResponsiveSources(
      metadata.src,
      IMAGE_SIZES[category]
    );
  }
}

