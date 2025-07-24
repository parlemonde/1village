import { UserType } from 'types/user.type';

import type { ReactNode } from 'react';

import Link from 'next/link';
import React from 'react';

import { UserContext } from 'src/contexts/userContext';
import BackArrow from 'src/svg/back-arrow.svg';

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
    <div>
      <Link href="/admin/newportal/create">
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <BackArrow />
          <h1 style={{ marginLeft: '10px' }}>Créer du contenu libre</h1>
        </div>
      </Link>
      {children}
    </div>
  );
}
