export const FEATURE_FLAGS = ['id-family' as const, 'toto' as const];

export type FeatureFlags = typeof FEATURE_FLAGS[number];
