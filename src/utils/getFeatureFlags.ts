import { getUserFeatureFlags } from 'src/api/featureFlag/featureFlag.get';
import type { User } from 'types/user.type';

export const getFeatureFlags = async (user: User | null, featureFlagName: string): Promise<boolean> => {
  if (!user) return false;

  const featureFlags = await getUserFeatureFlags(user.id);

  // Check if the user has the specified feature flag and it's enabled
  return featureFlags.some((flag) => flag.name === featureFlagName && flag.isEnabled);
};
