import { FeatureFlag } from '../entities/featureFlag';
import type { User } from '../entities/user';
import { AppDataSource } from './data-source';

const isFeatureEnabledForUser = async (user: User, featureName: string): Promise<boolean> => {
  const featureFlag = await AppDataSource.getRepository(FeatureFlag).findOne({ where: { name: featureName } });

  if (!featureFlag) {
    return false;
  }

  if (featureFlag.isEnabled) {
    return true;
  }

  if (featureFlag.users.some((allowedUser) => allowedUser.id === user.id)) {
    return true;
  }

  return false;
};

export default isFeatureEnabledForUser;
