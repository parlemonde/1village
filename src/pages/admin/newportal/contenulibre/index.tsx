import dynamic from 'next/dynamic';
import Link from 'next/link';
import React from 'react';

const ContenuLibreStep1Dynamic = dynamic(() => import('./1'), { ssr: false });
import { UserContext } from 'src/contexts/userContext';
import BackArrow from 'src/svg/back-arrow.svg';
import { UserType } from 'types/user.type';

const ContenuLibre = () => {
  const { user } = React.useContext(UserContext);

  const isModerator = user !== null && user.type <= UserType.MEDIATOR;

  const renderBackButton = (
    <Link href="/admin/newportal/create">
      <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <BackArrow />
        <h1 style={{ marginLeft: '10px' }}>Créer du contenu libre</h1>
      </div>
    </Link>
  );

  if (!isModerator) {
    return <h1>Vous n&apos;avez pas accès à cette page, vous devez être modérateur.</h1>;
  }

  return (
    <div>
      {renderBackButton}
      <p className="text">Un contenu libre est une activité publiée dans le fil d’activité par Pélico</p>
      <ContenuLibreStep1Dynamic />
    </div>
  );
};

export default ContenuLibre;
