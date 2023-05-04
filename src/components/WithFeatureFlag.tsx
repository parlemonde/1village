import type { ComponentType } from 'react';
import React, { useEffect, useState, useContext } from 'react';

import { UserContext } from 'src/contexts/userContext';
import type { User } from 'types/user.type';

interface WithFeatureFlagProps {
  featureName: string;
}

const WithFeatureFlag =
  (featureName: string, checkFeatureFlag: (user: User | null, featureName: string) => Promise<boolean>) =>
  <P extends object>(Component: ComponentType<P>): React.FC<P & WithFeatureFlagProps> => {
    const WrappedComponent: React.FC<P & WithFeatureFlagProps> = (props: P) => {
      const { user } = useContext(UserContext);
      const [loading, setLoading] = useState(true);
      const [hasAccess, setHasAccess] = useState(false);

      useEffect(() => {
        const checkAccess = async () => {
          if (!user) {
            setLoading(false);
            return;
          }

          try {
            const hasAccessToFeature = await checkFeatureFlag(user, featureName);
            setHasAccess(hasAccessToFeature);
          } catch (error) {
            console.error('Error checking feature flag access:', error);
          } finally {
            setLoading(false);
          }
        };

        checkAccess();
      }, [user]);

      if (loading) {
        return <div>Loading...</div>;
      }

      if (!hasAccess) {
        return null;
      }

      return <Component {...props} />;
    };

    WrappedComponent.displayName = `WithFeatureFlag(${Component.displayName || Component.name || 'Component'})`;

    return WrappedComponent;
  };

export default WithFeatureFlag;
