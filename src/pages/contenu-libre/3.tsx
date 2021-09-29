import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';

const ContenuLibre = () => {
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={['Contenu', 'Forme', 'Prévisualiser']} activeStep={2} />
        <div className="width-900">
          <h1>Pré-visualisez votre publication</h1>
          <StepsButton prev="/contenu-libre/2" />
        </div>
      </div>
    </Base>
  );
};

export default ContenuLibre;
