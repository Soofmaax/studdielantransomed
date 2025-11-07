'use client';

import { 
  useState, 
  useEffect, 
  useRef, 
  useCallback, 
  useMemo,
  Suspense,
  ComponentType,
  ReactNode,
  memo,
  forwardRef,
  lazy,
} from 'react';

import { cn } from '@/lib/utils';

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
  ref: React.RefObject<HTMLElement>,
  options: IIntersectionOptions = {},
  once = true
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);

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
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersection, {
      root,
      rootMargin,
      threshold,
    });

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
      observer.disconnect();
    };
  }, [ref, handleIntersection, root, rootMargin, threshold]);

  return once ? hasIntersected : isIntersecting;
}

/**
 * Composant de fallback par défaut pendant le chargement
 */
const DefaultFallback = memo<{ className?: string }>(({ className }) => (
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
const LazySection = forwardRef<HTMLDivElement, ILazySectionProps>(
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
    
    const internalRef = useRef<HTMLDivElement>(null);
    // On combine la ref interne et la ref externe
    const ref = forwardedRef || internalRef;

    const shouldRender = useIntersectionObserver(ref as React.RefObject<HTMLDivElement>, intersectionOptions, once);

    useEffect(() => {
      if (onIntersect) {
        onIntersect(shouldRender);
      }
    }, [shouldRender, onIntersect]);

    const memoizedFallback = useMemo(() => {
      if (fallback) return fallback;
      return <DefaultFallback className={className} />;
    }, [fallback, className]);

    if (disabled) {
      return (
        <div
          ref={ref}
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
        ref={ref}
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

// ====================================================================
// == CORRECTION APPLIQUÉE ICI : Simplification radicale des HOCs ==
// ====================================================================

/**
 * Hook pour créer des composants lazy (simplifié)
 */
export function useLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) {
  return useMemo(() => lazy(importFn), [importFn]);
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
 * HOC pour rendre un composant lazy (simplifié)
 */
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  options: {
    fallback?: ReactNode;
    intersectionOptions?: IIntersectionOptions;
  } = {}
) {
  const { fallback, intersectionOptions } = options;

  const LazyWrappedComponent = (props: P & { className?: string }) => (
    <LazySection
      fallback={fallback}
      intersectionOptions={intersectionOptions}
      className={props.className}
    >
      <Component {...props} />
    </LazySection>
  );

  LazyWrappedComponent.displayName = `withLazyLoading(${Component.displayName || Component.name})`;

  return LazyWrappedComponent;
}

export default LazySection;
