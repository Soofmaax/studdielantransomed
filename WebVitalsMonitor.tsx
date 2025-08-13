/**
 * Composant Web Vitals Monitor - Version corrigée pour Netlify
 * Compatible avec les nouvelles API web-vitals
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { onCLS, onFID, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

/**
 * Interface pour les métriques de performance
 */
interface IPerformanceMetrics {
  cls: number | null;
  fid: number | null;
  fcp: number | null;
  lcp: number | null;
  ttfb: number | null;
  timestamp: number;
  url: string;
  userAgent: string;
}

/**
 * Interface pour les seuils de performance
 */
interface IPerformanceThresholds {
  cls: { good: number; needsImprovement: number };
  fid: { good: number; needsImprovement: number };
  fcp: { good: number; needsImprovement: number };
  lcp: { good: number; needsImprovement: number };
  ttfb: { good: number; needsImprovement: number };
}

/**
 * Seuils de performance selon les recommandations Google
 */
const PERFORMANCE_THRESHOLDS: IPerformanceThresholds = {
  cls: { good: 0.1, needsImprovement: 0.25 },
  fid: { good: 100, needsImprovement: 300 },
  fcp: { good: 1800, needsImprovement: 3000 },
  lcp: { good: 2500, needsImprovement: 4000 },
  ttfb: { good: 800, needsImprovement: 1800 },
};

/**
 * Service de monitoring des performances
 */
class PerformanceMonitoringService {
  private static metrics: Partial<IPerformanceMetrics> = {};
  private static listeners: Array<(metrics: Partial<IPerformanceMetrics>) => void> = [];

  /**
   * Ajoute un listener pour les mises à jour de métriques
   */
  static addListener(callback: (metrics: Partial<IPerformanceMetrics>) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  /**
   * Met à jour une métrique et notifie les listeners
   */
  static updateMetric(name: keyof IPerformanceMetrics, value: number) {
    this.metrics[name] = value;
    this.notifyListeners();
  }

  /**
   * Notifie tous les listeners des changements
   */
  private static notifyListeners() {
    this.listeners.forEach(listener => listener(this.metrics));
  }

  /**
   * Obtient le score de performance pour une métrique
   */
  static getPerformanceScore(metricName: keyof IPerformanceThresholds, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = PERFORMANCE_THRESHOLDS[metricName];
    
    if (value <= thresholds.good) return 'good';
    if (value <= thresholds.needsImprovement) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Calcule le score global de performance
   */
  static getOverallScore(): number {
    const metrics = this.metrics;
    let totalScore = 0;
    let metricCount = 0;

    Object.entries(metrics).forEach(([key, value]) => {
      if (value !== null && key !== 'timestamp' && key !== 'url' && key !== 'userAgent') {
        const score = this.getPerformanceScore(key as keyof IPerformanceThresholds, value);
        totalScore += score === 'good' ? 100 : score === 'needs-improvement' ? 50 : 0;
        metricCount++;
      }
    });

    return metricCount > 0 ? Math.round(totalScore / metricCount) : 0;
  }

  /**
   * Envoie les métriques à un service d'analytics
   */
  static async sendToAnalytics(metric: Metric) {
    // En développement, log dans la console
    if (process.env.NODE_ENV === 'development') {
      console.info(`Web Vital ${metric.name}:`, {
        value: metric.value,
        rating: this.getPerformanceScore(metric.name as keyof IPerformanceThresholds, metric.value),
        delta: metric.delta,
        id: metric.id,
      });
    }

    // En production, envoyer à Google Analytics ou autre service
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      try {
        // Google Analytics 4
        if (typeof window.gtag === 'function') {
          window.gtag('event', metric.name, {
            event_category: 'Web Vitals',
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            event_label: metric.id,
            non_interaction: true,
          });
        }
      } catch (error) {
        console.error('Erreur lors de l\'envoi des métriques:', error);
      }
    }
  }
}

/**
 * Hook pour surveiller les Web Vitals
 */
export function useWebVitals() {
  const metricsRef = useRef<Partial<IPerformanceMetrics>>({});
  const [, forceUpdate] = useState({});

  const handleMetric = useCallback((metric: Metric) => {
    // Mettre à jour les métriques locales
    metricsRef.current[metric.name.toLowerCase() as keyof IPerformanceMetrics] = metric.value;
    
    // Mettre à jour le service global
    PerformanceMonitoringService.updateMetric(
      metric.name.toLowerCase() as keyof IPerformanceMetrics,
      metric.value
    );

    // Envoyer à l'analytics
    PerformanceMonitoringService.sendToAnalytics(metric);
    
    // Forcer la mise à jour du composant
    forceUpdate({});
  }, []);

  useEffect(() => {
    // Initialiser la surveillance des Web Vitals avec les nouvelles API
    onCLS(handleMetric);
    onFID(handleMetric);
    onFCP(handleMetric);
    onLCP(handleMetric);
    onTTFB(handleMetric);

    // Ajouter des métadonnées
    if (typeof window !== 'undefined') {
      metricsRef.current.timestamp = Date.now();
      metricsRef.current.url = window.location.href;
      metricsRef.current.userAgent = navigator.userAgent;
    }
  }, [handleMetric]);

  return {
    metrics: metricsRef.current,
    overallScore: PerformanceMonitoringService.getOverallScore(),
  };
}

/**
 * Composant de monitoring des Web Vitals (visible en développement uniquement)
 */
export function WebVitalsMonitor() {
  const { metrics, overallScore } = useWebVitals();

  // Afficher uniquement en développement
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-900">Web Vitals</h3>
        <div className={`px-2 py-1 rounded text-xs font-medium ${
          overallScore >= 80 ? 'bg-green-100 text-green-800' :
          overallScore >= 50 ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {overallScore}/100
        </div>
      </div>

      <div className="space-y-1 text-xs">
        {Object.entries(metrics).map(([key, value]) => {
          if (key === 'timestamp' || key === 'url' || key === 'userAgent' || value === null) return null;
          
          const score = PerformanceMonitoringService.getPerformanceScore(
            key as keyof IPerformanceThresholds,
            value
          );
          
          return (
            <div key={key} className="flex justify-between items-center">
              <span className="text-gray-600 uppercase">{key}:</span>
              <div className="flex items-center space-x-2">
                <span className="text-gray-900">
                  {key === 'cls' ? value.toFixed(3) : Math.round(value)}
                  {key !== 'cls' && 'ms'}
                </span>
                <div className={`w-2 h-2 rounded-full ${
                  score === 'good' ? 'bg-green-500' :
                  score === 'needs-improvement' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Composant pour précharger les ressources critiques
 */
export function ResourcePreloader() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Précharger les fonts critiques
    const fontPreloads = [
      '/fonts/inter-var.woff2',
      '/fonts/playfair-display-var.woff2',
    ];

    fontPreloads.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Précharger les images critiques
    const criticalImages = [
      '/images/hero/yoga-studio-main.jpg',
      '/images/about/instructor-portrait.jpg',
    ];

    criticalImages.forEach(image => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = image;
      link.as = 'image';
      document.head.appendChild(link);
    });
  }, []);

  return null;
}

export default WebVitalsMonitor;

