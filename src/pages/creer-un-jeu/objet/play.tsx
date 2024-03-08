import React from 'react';

import Jouer from 'src/components/game/DiplayGameById';

const MonComposant = () => {
  // Rendu du composant
  return (
    <div>
      <Jouer subType={1} />
    </div>
  );
};

export default MonComposant;
