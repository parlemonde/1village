import type { ReactNode } from 'react';
import React from 'react';

import { UserContext } from 'src/contexts/userContext';

interface ShowForProps {
  roles: number[];
  children: ReactNode;
}

const ShowFor: React.FC<ShowForProps> = ({ roles = [], children }) => {
  const { user } = React.useContext(UserContext);

  if (user != null && roles.includes(user.type)) {
    return <>{children}</>;
  }
  return null;
};

export default ShowFor;
