import { z } from 'zod';

export const FeatureFlagSchema = z.object({
  name: z.string(),
  enabled: z.boolean(),
  rolloutPercentage: z.number().min(0).max(100).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  allowedRoles: z.array(z.enum(['ADMIN', 'CLIENT'])).optional(),
});

export type FeatureFlag = z.infer<typeof FeatureFlagSchema>;

const features: FeatureFlag[] = [
  {
    name: 'newBookingSystem',
    enabled: process.env.NEXT_PUBLIC_ENABLE_NEW_BOOKING === 'true',
    rolloutPercentage: 50,
    allowedRoles: ['ADMIN', 'CLIENT'],
  },
  {
    name: 'enhancedAnalytics',
    enabled: process.env.NEXT_PUBLIC_ENABLE_ENHANCED_ANALYTICS === 'true',
    rolloutPercentage: 25,
    allowedRoles: ['ADMIN'],
  },
  {
    name: 'betaFeatures',
    enabled: process.env.NEXT_PUBLIC_ENABLE_BETA === 'true',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-06-30'),
    allowedRoles: ['ADMIN'],
  }
];

export function isFeatureEnabled(
  featureName: string,
  context?: {
    userId?: string;
    userRole?: string;
  }
): boolean {
  const feature = features.find(f => f.name === featureName);
  
  if (!feature) return false;
  if (!feature.enabled) return false;
  
  // Check date constraints
  const now = new Date();
  if (feature.startDate && now < feature.startDate) return false;
  if (feature.endDate && now > feature.endDate) return false;
  
  // Check role constraints
  if (feature.allowedRoles && context?.userRole) {
    if (!feature.allowedRoles.includes(context.userRole as any)) {
      return false;
    }
  }
  
  // Check rollout percentage
  if (feature.rolloutPercentage && context?.userId) {
    const hash = hashString(context.userId);
    return (hash % 100) < feature.rolloutPercentage;
  }
  
  return true;
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getAllFeatures(): FeatureFlag[] {
  return features;
}

export function validateFeatureFlag(flag: unknown): FeatureFlag {
  return FeatureFlagSchema.parse(flag);
}