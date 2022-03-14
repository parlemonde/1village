import React from 'react';

import { Base } from 'src/components/Base';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';

const StorySuccess = () => {
  return (
    <Base>
      <div style={{ width: '100%', padding: '1rem 1rem 1rem 1rem' }}>
        <p className="text" style={{ margin: '1rem 1.5rem' }}>
          Votre reportage a bien été publié !
        </p>
        <PelicoSouriant style={{ width: '60%', height: 'auto', margin: '0 20%' }} />
      </div>
    </Base>
  );
};

export default StorySuccess;
