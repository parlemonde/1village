import React from 'react';

import { bgPage } from 'src/styles/variables.const';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';

const FreeContentSuccess = () => {
  return (
    <div>
      <div style={{ width: '100%', padding: '1rem 1rem 1rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: '20rem', margin: '4rem auto', backgroundColor: bgPage, padding: '1rem', borderRadius: '10px' }}>
          <p className="text" style={{ textAlign: 'center' }}>
            La publication a été crée ! Rendez-vous dans l’espace de publication pour la rendre visible aux classes
          </p>
          <PelicoSouriant style={{ width: '60%', height: 'auto', margin: '0 20%' }} />
        </div>
      </div>
    </div>
  );
};

export default FreeContentSuccess;
