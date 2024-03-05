import React from 'react';

import { Base } from 'src/components/Base';
import List from 'src/components/game/List';

const DisplayList = () => {
  // Rendu du composant
  return (
    <Base>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>Voici tous les jeux des expressions disponibles</div>

      <List subType={1} />
    </Base>
  );
};

export default DisplayList;
