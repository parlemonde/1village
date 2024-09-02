import Link from 'next/link';
import React from 'react';

import { UserContext } from 'src/contexts/userContext';
import BackArrow from 'src/svg/back-arrow.svg';
import { UserType } from 'types/user.type';

const Activities = () => {
  const { user } = React.useContext(UserContext);
  const hasAccess = user?.type === UserType.SUPER_ADMIN;

  if (!hasAccess) {
    return <h1>Vous n&apos;avez pas accès à cette page, vous devez être super admin.</h1>;
  }
  return (
    <div>
      <Link href="/admin/newportal/manage">
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <BackArrow />
          <h1 style={{ marginLeft: '10px' }}>Consignes d&apos;activité</h1>
        </div>
      </Link>
      <p>Il y a ici la liste complète des villages-mondes.</p>
    </div>
  );
};

export default Activities;
