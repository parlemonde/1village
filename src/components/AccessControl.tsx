import { useRouter } from 'next/router';
import React, { useEffect, useState, useContext } from 'react';

import { UserContext } from 'src/contexts/userContext';
import hasFeatureFlag from 'src/utils/hasFeatureFlag';

interface AccessControlProps {
  featureName: string;
  children: React.ReactNode;
  redirectToWIP?: boolean;
}

const AccessControl: React.FC<AccessControlProps> = ({ featureName, children, redirectToWIP = false }) => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const hasAccessToFeature = await hasFeatureFlag(user, featureName);
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
