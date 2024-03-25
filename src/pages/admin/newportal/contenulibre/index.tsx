import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import ContenuLibreStep1 from './1';
import { UserContext } from 'src/contexts/userContext';
import BackArrow from 'src/svg/back-arrow.svg';
import { UserType } from 'types/user.type';

const ContenuLibre = () => {
  const { user } = React.useContext(UserContext);

  const isModerator = user !== null && user.type <= UserType.MEDIATOR;

  const backButton = () => {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            cursor: 'pointer',
          }}
        >
          <Link href="/admin/newportal/create">
            <BackArrow />
          </Link>
        </div>
        <h1 style={{ marginLeft: '10px' }}>Créer du contenu libre</h1>
      </div>
    );
  };

  if (!isModerator) {
    return <h1>Vous n&apos;avez pas accès à cette page, vous devez être modérateur.</h1>;
  }

  return (
    <div>
      <div>
        {backButton()}
        <p className="text">Un contenu libre est une activité publiée dans le fil d’activité par Pélico</p>
        <ContenuLibreStep1 />
      </div>
    </div>
  );
};

export default ContenuLibre;
