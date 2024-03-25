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
      <a href="/admin/newportal/create" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
        <BackArrow />
        <h1 style={{ marginLeft: '10px' }}>Créer du contenu libre</h1>
      </a>
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
