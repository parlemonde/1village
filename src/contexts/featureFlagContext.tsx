import React, { createContext, useContext, useEffect, useState } from 'react';

import { UserContext } from './userContext';
import { getUserFeatureFlags } from 'src/api/featureFlag/featureFlag.get';
import type { FeatureFlag } from 'types/featureFlag.type';

interface FeatureFlagContextProps {
  featureFlag: FeatureFlag[] | null;
  setFeatureFlag: React.Dispatch<React.SetStateAction<FeatureFlag[] | null>>;
}

export const FeatureFlagContext = createContext<FeatureFlagContextProps>({
  featureFlag: null,
  setFeatureFlag: () => {},
});

interface FeatureFlagProviderProps {
  children: React.ReactNode;
}

export const FeatureFlagProvider: React.FC<FeatureFlagProviderProps> = ({ children }) => {
  const { user } = useContext(UserContext);
  const [featureFlag, setFeatureFlag] = useState<FeatureFlag[] | null>(null);

  useEffect(() => {
    if (user) {
      const fetchFeatureFlags = async () => {
        try {
          const featureFlags = await getUserFeatureFlags(user.id);
          if (featureFlags.length > 0) {
            setFeatureFlag(featureFlags);
          } else {
            console.warn('User has no feature flags.');
          }
        } catch (error) {
          console.error('Failed to fetch feature flags:', error);
        }
      };

      fetchFeatureFlags();
    }
  }, [user]);

  return <FeatureFlagContext.Provider value={{ featureFlag, setFeatureFlag }}>{children}</FeatureFlagContext.Provider>;
};
