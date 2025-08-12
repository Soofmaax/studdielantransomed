'use client';

import React, { 
  useState, 
  useEffect, 
  useRef, 
  useCallback, 
  useMemo,
  Suspense,
  ComponentType,
  ReactNode 
} from 'react';
import { cn } from '@/lib/utils';

// ====================================================================
// == CORRECTION 1 : Création d'un hook pour fusionner les refs ==
// Ce hook résout le problème de la propriété en lecture seule.
// ====================================================================
const useCombinedRefs = <T extends any>(...refs: React.Ref<T>[]) => {
  const targetRef = React.useRef<T>(null);

  React.useEffect(() => {
    refs.forEach(ref => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        (ref as React.MutableRefObject<T | null>).current = targetRef.current;
      }
    });
  }, [refs]);

  return targetRef;
};

/**
 * Options pour l'Intersection Observer
 */
interface IIntersectionOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
}

/**
 * Props du composant LazySection
 */
interface ILazySectionProps {
  children: ReactNode;
  className?: string;
  fallback?: ReactNode;
  intersectionOptions?: IIntersectionOptions;
  once?: boolean;
  disabled?: boolean;
  onIntersect?: (isIntersecting: boolean) => void;
  'data-testid'?: string;
}

/**
 * Hook personnalisé pour l'Intersection Observer
 */
function useIntersectionObserver(
  options: IIntersectionOptions = {},
  once = true
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const {
    root = null,
    rootMargin = '50px',
    threshold = 0.1,
  } = options;

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    const isCurrentlyIntersecting = entry.isIntersecting;
    
    setIsIntersecting(isCurrentlyIntersecting);
    
    if (isCurrentlyIntersecting && !hasIntersected) {
      setHasIntersected(true);
    }
  }, [hasIntersected]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersection, {
      root,
      rootMargin,
      threshold,
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [handleIntersection, root, rootMargin, threshold]);

  const shouldRender = once ? hasIntersected : isIntersecting;

  return {
    elementRef,
    isIntersecting,
    hasIntersected,
    shouldRender,
  };
}

/**
 * Composant de fallback par défaut pendant le chargement
 */
const DefaultFallback = React.memo<{ className?: string }>(({ className }) => (
  <div 
    className={cn(
      'flex items-center justify-center py-12',
      'bg-gradient-to-br from-sage/5 to-gold/5',
      'animate-pulse',
      className
    )}
    aria-label="Chargement du contenu..."
  >
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-sage/30 rounded-full animate-bounce" />
      <div className="w-3 h-3 bg-sage/30 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
      <div className="w-3 h-3 bg-sage/30 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
    </div>
  </div>
));

DefaultFallback.displayName = 'DefaultFallback';

/**
 * Composant LazySection principal
 */
const LazySection = React.forwardRef<HTMLDivElement, ILazySectionProps>(
  ({
    children,
    className,
    fallback,
    intersectionOptions = {},
    once = true,
    disabled = false,
    onIntersect,
    'data-testid': testId,
    ...props
  }, forwardedRef) => {
    const {
      elementRef,
      isIntersecting,
      shouldRender,
    } = useIntersectionObserver(intersectionOptions, once);

    useEffect(() => {
      if (onIntersect) {
        onIntersect(isIntersecting);
      }
    }, [isIntersecting, onIntersect]);

    const memoizedFallback = useMemo(() => {
      if (fallback) return fallback;
      return <DefaultFallback className={className} />;
    }, [fallback, className]);

    // ====================================================================
    // == CORRECTION 2 : Utilisation du hook pour fusionner les refs ==
    // ====================================================================
    const combinedRef = useCombinedRefs(elementRef, forwardedRef);

    if (disabled) {
      return (
        <div
          ref={forwardedRef}
          className={className}
          data-testid={testId}
          {...props}
        >
          {children}
        </div>
      );
    }

    return (
      <div
        ref={combinedRef}
        className={className}
        data-testid={testId}
        {...props}
      >
        {shouldRender ? (
          <Suspense fallback={memoizedFallback}>
            {children}
          </Suspense>
        ) : (
          memoizedFallback
        )}
      </div>
    );
  }
);

LazySection.displayName = 'LazySection';

/**
 * Hook pour créer des composants lazy
 */
export function useLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ReactNode
) {
  return useMemo(() => {
    const LazyComponent = React.lazy(importFn);
    
    return React.forwardRef<any, React.ComponentProps<T>>((props, ref) => (
      <Suspense fallback={fallback || <DefaultFallback />}>
        <LazyComponent {...props} ref={ref} />
      </Suspense>
    ));
  }, [importFn, fallback]);
}

/**
 * Composant wrapper pour les sections critiques above-the-fold
 */
export const CriticalSection = React.memo<{
  children: ReactNode;
  className?: string;
}>(({ children, className }) => (
  <div className={className}>
    {children}
  </div>
));

CriticalSection.displayName = 'CriticalSection';

/**
 * Composant wrapper pour les sections non-critiques below-the-fold
 */
export const NonCriticalSection = React.memo<
  Omit<ILazySectionProps, 'once'>
>(props => (
  <LazySection {...props} once={true} />
));

NonCriticalSection.displayName = 'NonCriticalSection';

/**
 * HOC pour rendre un composant lazy
 */
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  options: {
    fallback?: ReactNode;
    intersectionOptions?: IIntersectionOptions;
  } = {}
) {
  const { fallback, intersectionOptions } = options;

  const LazyWrappedComponent = React.forwardRef<any, P & { className?: string }>(
    (props, ref) => (
      <LazySection
        fallback={fallback}
        intersectionOptions={intersectionOptions}
        className={props.className}
      >
        <Component {...props} ref={ref} />
      </LazySection>
    )
  );

  LazyWrappedComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;

  return LazyWrappedComponent;
}

/**
 * Utilitaires pour les performances
 */
export class LazyLoadingUtils {
  /**
   * Précharge un composant lazy
   */
  static preloadComponent<T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>
  ): Promise<{ default: T }> {
    return importFn();
  }

  /**
   * Précharge plusieurs composants en parallèle
   */
  static async preloadComponents(
    importFns: Array<() => Promise<{ default: ComponentType<any> }>>
  ): Promise<void> {
    await Promise.all(importFns.map(fn => fn()));
  }

  /**
   * Crée des options d'intersection optimisées selon le type de contenu
   */
  static getOptimizedIntersectionOptions(
    contentType: 'image' | 'text' | 'interactive' | 'heavy'
  ): IIntersectionOptions {
    switch (contentType) {
      case 'image':
        return {
          rootMargin: '100px',
          threshold: 0.1,
        };
      case 'text':
        return {
          rootMargin: '50px',
          threshold: 0.2,
        };
      case 'interactive':
        return {
          rootMargin: '200px',
          threshold: 0.1,
        };
      case 'heavy':
        return {
          rootMargin: '300px',
          threshold: 0.05,
        };
      default:
        return {
          rootMargin: '50px',
          threshold: 0.1,
        };
    }
  }
}

export default LazySection;
