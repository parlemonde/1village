import type { ReactNode } from 'react';
import React from 'react';

import ActivitiyCreationLayout from 'src/components/admin/ActivitiyCreationLayout';
import { UserContext } from 'src/contexts/userContext';
import { UserType } from 'types/user.type';

type Props = {
  children: ReactNode;
};

export default function Layout({ children }: Props) {
  const { user } = React.useContext(UserContext);
  const isModerator = user !== null && user.type <= UserType.MEDIATOR;

  if (!isModerator) {
    return <h1>Vous n&apos;avez pas accès à cette page, vous devez être modérateur.</h1>;
  }
  return (
    <ActivitiyCreationLayout title={'Créer Une activité h5p'} linkTo={'/admin/newportal/create'}>
      {children}
    </ActivitiyCreationLayout>
  );
}
