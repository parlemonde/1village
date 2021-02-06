import React from 'react';

import { Base } from 'src/components/Base';
import { Activities } from 'src/components/activities/List';

const MesActivites: React.FC = () => {
  return (
    <Base>
      <h1>{'Mes activités'}</h1>
      <Activities onlySelf={true} />
    </Base>
  );
};

export default MesActivites;
