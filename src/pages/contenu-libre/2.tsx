import { useRouter } from 'next/router';
import React from 'react';

import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';

const ContenuLibre = () => {
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={['Contenu', 'Forme', 'Pré-visualiser']} activeStep={1} />
        <div className="width-900">
          <h1>Ajustez l&apos;apparence de votre publication</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Vous pouvez ajuster le titre, l&apos;extrait et l&apos;image à la une de votre publication qui sera intégrée sur le fil d&apos;actualité.
            Vous pouvez également décider de mettre votre publication à l&apos;avant, tout en haut du fil d&apos;actualité.
          </p>
          <StepsButton prev="/contenu-libre" next="/contenu-libre/3" />
        </div>
      </div>
    </Base>
  );
};

export default ContenuLibre;
