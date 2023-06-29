import { useRouter } from 'next/router';
import React, { useEffect, useState, useContext } from 'react';

import { FeatureFlagContext } from 'src/contexts/featureFlagContext';
import { UserContext } from 'src/contexts/userContext';
import type { FeatureFlagsNames } from 'types/featureFlag.constant';
import type { FeatureFlag } from 'types/featureFlag.type';

interface AccessControlProps {
  featureName: FeatureFlagsNames;
  children: React.ReactNode;
  redirectToWIP?: boolean;
}

const hasFeatureFlag = (featureFlags: FeatureFlag[] | null, featureName: FeatureFlagsNames): boolean => {
  if (!featureFlags) return false;

  const featureFlag = featureFlags.find((flag) => flag.name === featureName);

  if (featureFlag && featureFlag.isEnabled) {
    return true;
  }

  return false;
};

const AccessControl: React.FC<AccessControlProps> = ({ featureName, children, redirectToWIP = false }) => {
  const { user } = useContext(UserContext);
  const { featureFlag } = useContext(FeatureFlagContext);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const hasAccessToFeature = hasFeatureFlag(featureFlag, featureName);
        setHasAccess(hasAccessToFeature);
      } catch (error) {
        console.error('Error checking feature flag access:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, featureName, featureFlag]);

  useEffect(() => {
    if (!loading && !hasAccess && redirectToWIP) {
      router.push('/404');
    }
  }, [loading, hasAccess, redirectToWIP, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!hasAccess) {
    return null;
  }

  return <>{children}</>;
};

export default AccessControl;
