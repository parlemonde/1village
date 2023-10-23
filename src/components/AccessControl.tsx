import { useRouter } from 'next/router';
import * as React from 'react';

import { useIsFeatureFlagEnabled } from 'src/api/featureFlag/featureFlag.get';
import type { FeatureFlagsNames } from 'types/featureFlag.constant';

interface AccessControlProps {
  featureName: FeatureFlagsNames;
  redirectToWIP?: boolean;
}

const AccessControl = ({ featureName, children, redirectToWIP = false }: React.PropsWithChildren<AccessControlProps>) => {
  const router = useRouter();
  const { isEnabled, isLoading } = useIsFeatureFlagEnabled(featureName);

  React.useEffect(() => {
    if (!isLoading && !isEnabled && redirectToWIP) {
      router.push('/404');
    }
  }, [isLoading, isEnabled, redirectToWIP, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isEnabled) {
    return null;
  }

  return <>{children}</>;
};

export default AccessControl;
