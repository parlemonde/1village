import { useRouter } from 'next/router';
import React, { useEffect, useState, useContext } from 'react';

import { UserContext } from 'src/contexts/userContext';
import type { FeatureFlagsNames } from 'types/featureFlag.constant';
import type { User } from 'types/user.type';

interface AccessControlProps {
  featureName: FeatureFlagsNames;
  children: React.ReactNode;
  redirectToWIP?: boolean;
}

const hasFeatureFlag = (user: User | null, featureName: FeatureFlagsNames): boolean => {
  if (!user) return false;

  const featureFlag = user.featureFlags.find((flag) => flag.name === featureName);

  if (featureFlag && featureFlag.isEnabled) {
    return true;
  }

  return false;
};

const AccessControl: React.FC<AccessControlProps> = ({ featureName, children, redirectToWIP = false }) => {
  const { user } = useContext(UserContext);
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
        const hasAccessToFeature = hasFeatureFlag(user, featureName);
        setHasAccess(hasAccessToFeature);
      } catch (error) {
        console.error('Error checking feature flag access:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [user, featureName]);

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
