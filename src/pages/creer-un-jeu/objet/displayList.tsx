import React from 'react';

import { Base } from 'src/components/Base';
import List from 'src/components/game/List';

const DisplayList = () => {
  // Rendu du composant
  return (
    <Base>
      <h1 style={{ display: 'flex', justifyContent: 'space-around', marginTop: 20, marginBottom: 50 }}>Voici la liste des jeux des objets !</h1>

      <div style={{ maxWidth: 900, display: 'flex', margin: 'auto' }}>
        <List subType={1} />
      </div>
    </Base>
  );
};

export default DisplayList;
