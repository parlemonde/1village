import { getUserFeatureFlags } from 'src/api/featureFlag/featureFlag.get';
import type { User } from 'types/user.type';

const hasFeatureFlag = async (user: User | null, featureName: string): Promise<boolean> => {
  if (!user) return false;

  try {
    const userFeatureFlags = await getUserFeatureFlags(user.id);
    const featureFlag = userFeatureFlags.find((flag) => flag.name === featureName);

    if (featureFlag && featureFlag.isEnabled) {
      return true;
    }
  } catch (error) {
    console.error('Error checking feature flag:', error);
  }

  return false;
};

export default hasFeatureFlag;
