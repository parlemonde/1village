import React, { useContext } from 'react';

import { Base } from 'src/components/Base';
import List from 'src/components/game/List';
import { VillageContext } from 'src/contexts/villageContext';

const DisplayList = () => {
  const village = useContext(VillageContext);
  return (
    <Base>
      <h1 style={{ display: 'flex', justifyContent: 'space-around', marginTop: 20, marginBottom: 50 }}>Voici la liste des jeux des expressions !</h1>
      <div style={{ maxWidth: 900, display: 'flex', margin: 'auto' }}>
        <List subType={0} villageId={village.village?.id} />
      </div>
    </Base>
  );
};

export default DisplayList;
