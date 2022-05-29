import React from 'react';

import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { UserType } from 'types/user.type';

import { FirstPhase } from './FirstPhase';
import { SecondPhase } from './SecondPhase';
import { ThirdPhase } from './ThirdPhase';

export const WelcomeModal = () => {
  const { user } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);

  if (!user || !village || user.type >= UserType.OBSERVATOR) {
    return null;
  }

  if (user.firstLogin === 0) {
    return <FirstPhase />;
  }
  if (user.firstLogin === 1 && village.activePhase > 1) {
    return <SecondPhase />;
  }
  if (user.firstLogin === 2 && village.activePhase > 2) {
    return <ThirdPhase />;
  }

  return null;
};
