/**
 * Composant Image optimisé - Approche artisanale
 * Performance maximale avec chargement progressif et formats modernes
 */

'use client';

import React, { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { 
  ImageOptimizationService, 
  StudioImageUtils, 
  IMAGE_SIZES,
  type IImageMetadata,
  type IImageSource 
} from '@/lib/image-optimization';

/**
 * Props du composant OptimizedImage
 */
export interface IOptimizedImageProps {
  // Props essentielles
  src: string;
  alt: string;
  width?: number;
  height?: number;
  
  // Props de performance
  priority?: boolean;
  loading?: 'lazy' | 'eager';
  quality?: number;
  
  // Props de style et layout
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  
  // Props responsive
  sizes?: string;
  category?: keyof typeof IMAGE_SIZES;
  
  // Props de fallback et placeholder
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  fallbackSrc?: string;
  
  // Props d'événements
  onLoad?: () => void;
  onError?: () => void;
  
  // Props d'accessibilité
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  
  // Props avancées
  unoptimized?: boolean;
  draggable?: boolean;
  
  // Props pour les images du studio
  studioImageKey?: string;
}

/**
 * Hook pour la gestion du chargement d'image
 */
function useImageLoading() {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  return {
    isLoading,
    hasError,
    handleLoad,
    handleError,
  };
}

/**
 * Hook pour la génération des métadonnées d'image
 */
function useImageMetadata(props: IOptimizedImageProps): IImageMetadata {
  return useMemo(() => {
    // Si une clé d'image studio est fournie, utiliser les métadonnées prédéfinies
    if (props.studioImageKey) {
      const studioMetadata = StudioImageUtils.getImageMetadata(props.studioImageKey);
      if (studioMetadata) {
        return {
          ...studioMetadata,
          priority: props.priority ?? studioMetadata.priority,
        };
      }
    }

    // Génération des métadonnées personnalisées
    const width = props.width || 800;
    const height = props.height || 600;
    
    return ImageOptimizationService.generateImageMetadata({
      src: props.src,
      alt: props.alt,
      width,
      height,
      priority: props.priority,
      category: props.category,
    });
  }, [props]);
}

/**
 * Composant de placeholder pendant le chargement
 */
const ImagePlaceholder = React.memo<{
  width: number;
  height: number;
  className?: string;
  isLoading: boolean;
}>(({ width, height, className, isLoading }) => (
  <div
    className={cn(
      'bg-gradient-to-br from-sage/10 to-gold/10 flex items-center justify-center',
      'transition-opacity duration-300',
      isLoading ? 'opacity-100' : 'opacity-0',
      className
    )}
    style={{ width, height }}
    aria-hidden="true"
  >
    <div className="animate-pulse">
      <div className="w-8 h-8 bg-sage/20 rounded-full animate-bounce" />
    </div>
  </div>
));

ImagePlaceholder.displayName = 'ImagePlaceholder';

/**
 * Composant de fallback en cas d'erreur
 */
const ImageFallback = React.memo<{
  width: number;
  height: number;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}>(({ width, height, alt, className, fallbackSrc }) => {
  if (fallbackSrc) {
    return (
      <Image
        src={fallbackSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        unoptimized
      />
    );
  }

  return (
    <div
      className={cn(
        'bg-gradient-to-br from-gray-100 to-gray-200',
        'flex items-center justify-center text-gray-400',
        'border border-gray-200 rounded',
        className
      )}
      style={{ width, height }}
      role="img"
      aria-label={`Image non disponible: ${alt}`}
    >
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
});

ImageFallback.displayName = 'ImageFallback';

/**
 * Composant OptimizedImage principal
 * 
 * Fonctionnalités :
 * - Optimisation automatique des formats (AVIF, WebP, JPEG)
 * - Chargement progressif avec placeholder
 * - Support responsive avec srcSet
 * - Gestion d'erreur avec fallback
 * - Accessibilité renforcée
 * - Performance optimisée avec Next.js Image
 */
const OptimizedImage = React.forwardRef<HTMLImageElement, IOptimizedImageProps>(
  (props, ref) => {
    const {
      className,
      objectFit = 'cover',
      objectPosition = 'center',
      loading = 'lazy',
      quality = 85,
      placeholder = 'blur',
      draggable = false,
      unoptimized = false,
      onLoad,
      onError,
      role,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      fallbackSrc,
      ...restProps
    } = props;

    const imageLoading = useImageLoading();
    const metadata = useImageMetadata(props);

    // Gestion des événements avec callbacks personnalisés
    const handleImageLoad = useCallback(() => {
      imageLoading.handleLoad();
      onLoad?.();
    }, [imageLoading.handleLoad, onLoad]);

    const handleImageError = useCallback(() => {
      imageLoading.handleError();
      onError?.();
    }, [imageLoading.handleError, onError]);

    // Styles pour l'image
    const imageStyles = useMemo(() => ({
      objectFit,
      objectPosition,
    }), [objectFit, objectPosition]);

    // Classes CSS combinées
    const imageClasses = cn(
      'transition-opacity duration-300',
      imageLoading.isLoading && 'opacity-0',
      !imageLoading.isLoading && 'opacity-100',
      className
    );

    // Rendu conditionnel en cas d'erreur
    if (imageLoading.hasError) {
      return (
        <ImageFallback
          width={metadata.width}
          height={metadata.height}
          alt={metadata.alt}
          className={className}
          fallbackSrc={fallbackSrc}
        />
      );
    }

    return (
      <div className="relative overflow-hidden">
        {/* Placeholder pendant le chargement */}
        {imageLoading.isLoading && (
          <ImagePlaceholder
            width={metadata.width}
            height={metadata.height}
            className="absolute inset-0 z-10"
            isLoading={imageLoading.isLoading}
          />
        )}

        {/* Image optimisée */}
        <Image
          ref={ref}
          src={metadata.src}
          alt={metadata.alt}
          width={metadata.width}
          height={metadata.height}
          priority={metadata.priority}
          quality={quality}
          loading={loading}
          placeholder={placeholder}
          blurDataURL={metadata.blurDataURL}
          sizes={metadata.sizes}
          className={imageClasses}
          style={imageStyles}
          draggable={draggable}
          unoptimized={unoptimized}
          onLoad={handleImageLoad}
          onError={handleImageError}
          role={role}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          {...restProps}
        />
      </div>
    );
  }
);

OptimizedImage.displayName = 'OptimizedImage';

/**
 * Composant spécialisé pour les images hero
 */
export const HeroImage = React.memo<
  Omit<IOptimizedImageProps, 'category' | 'priority' | 'loading'>
>(props => (
  <OptimizedImage
    {...props}
    category="hero"
    priority={true}
    loading="eager"
    className={cn('w-full h-full', props.className)}
  />
));

HeroImage.displayName = 'HeroImage';

/**
 * Composant spécialisé pour les cartes de contenu
 */
export const CardImage = React.memo<
  Omit<IOptimizedImageProps, 'category'>
>(props => (
  <OptimizedImage
    {...props}
    category="card"
    className={cn('w-full h-full', props.className)}
  />
));

CardImage.displayName = 'CardImage';

/**
 * Composant spécialisé pour les avatars
 */
export const AvatarImage = React.memo<
  Omit<IOptimizedImageProps, 'category' | 'objectFit'>
>(props => (
  <OptimizedImage
    {...props}
    category="avatar"
    objectFit="cover"
    className={cn('rounded-full', props.className)}
  />
));

AvatarImage.displayName = 'AvatarImage';

/**
 * Composant spécialisé pour les galeries
 */
export const GalleryImage = React.memo<
  Omit<IOptimizedImageProps, 'category'>
>(props => (
  <OptimizedImage
    {...props}
    category="gallery"
    className={cn('cursor-pointer hover:scale-105 transition-transform duration-200', props.className)}
  />
));

GalleryImage.displayName = 'GalleryImage';

export default OptimizedImage;

