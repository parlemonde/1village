import Link from 'next/link';
import React from 'react';

import { UserContext } from 'src/contexts/userContext';
import BackArrow from 'src/svg/back-arrow.svg';
import { UserType } from 'types/user.type';

const Archive = () => {
  const { user } = React.useContext(UserContext);
  const hasAccess = user?.type === UserType.SUPER_ADMIN;

  if (!hasAccess) {
    return <h1>Vous n&apos;avez pas accès à cette page, vous devez être super admin.</h1>;
  }
  return (
    <div>
      <Link href="/admin/newportal/manage/settings">
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <BackArrow />
          <h1 style={{ marginLeft: '10px' }}>Archiver</h1>
        </div>
      </Link>
      <p>Archiver 1Village va fermer l&apos;accès à tous les utilisateurs à la plateforme. Voilà les anciennes archives d&apos;1Village :</p>
    </div>
  );
};

export default Archive;
