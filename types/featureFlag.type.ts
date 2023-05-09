import type { FeatureFlagsNames } from './featureFlag.constant';

export interface FeatureFlag {
  id: number;
  name: FeatureFlagsNames;
  isEnabled: boolean;
}
