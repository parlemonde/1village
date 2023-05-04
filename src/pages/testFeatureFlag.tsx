import React, { useContext, useEffect, useState } from 'react';

import { UserContext } from 'src/contexts/userContext';
import { getFeatureFlags } from 'src/utils/getFeatureFlags';
import type { User } from 'types/user.type';

interface TestFeatureFlagProps {
  currentUser: User;
}

const TestFeatureFlag: React.FC<TestFeatureFlagProps> = () => {
  const [secretFeatureEnabled, setSecretFeatureEnabled] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    console.log('user:', user);

    const checkFeatureFlag = async () => {
      const hasFlag = await getFeatureFlags(user, 'trueFeature');
      setSecretFeatureEnabled(hasFlag);
    };
    checkFeatureFlag();
  }, [user]);

  return (
    <div>
      <h1>Test Feature Flag</h1>
      {secretFeatureEnabled ? (
        <div>
          <h2>Secret Feature</h2>
          <h2>Secret Feature</h2>
          <h2>Secret Feature</h2>
          <p>Welcome to the secret feature! This is only visible to users with the 'Secret Feature' flag enabled.</p>
        </div>
      ) : (
        <div>
          <h2>Standard Content</h2>
          <h2>Standard Content</h2>
          <h2>Standard Content</h2>
          <p>This is the standard content visible to users without the 'Secret Feature' flag enabled.</p>
        </div>
      )}
    </div>
  );
};

export default TestFeatureFlag;
