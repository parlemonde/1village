import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Button } from '@mui/material';

import { UserContext } from 'src/contexts/userContext';
import BackArrow from 'src/svg/back-arrow.svg';
import { UserType } from 'types/user.type';

const Anthem = () => {
  const { user } = React.useContext(UserContext);
  const router = useRouter();
  const hasAccess = user !== null && user.type in [UserType.MEDIATOR, UserType.ADMIN, UserType.SUPER_ADMIN];

  const handleLogCheckboxStates = () => {
    router.push('/admin/newportal/create/parametrer-hymne/1');
  };

  if (!hasAccess) {
    return <h1>Vous n&apos;avez pas accès à cette page, vous devez être médiateur, modérateur ou super admin.</h1>;
  }

  return (
    <div>
      <Link href="/admin/newportal/create">
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <BackArrow />
          <h1 style={{ marginLeft: '10px' }}>Paramétrer l’hymne</h1>
        </div>
      </Link>
      <div style={{ textAlign: 'right', marginTop: 30, marginBottom: 30 }}>
        <Button variant="contained" onClick={handleLogCheckboxStates}>
          Paramétrer un nouvel hymne
        </Button>
      </div>
    </div>
  );
};

export default Anthem;
