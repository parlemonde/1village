import React from 'react';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { Button } from '@material-ui/core';
import Link from 'next/link';
import { SimpleActivityEditor } from 'src/components/activities';

const MascotteStep3: React.FC = () => {
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/se-presenter" />
        <Steps steps={['Votre classe', 'Votre mascotte', 'Description de votre mascotte', "Prévisualiser"]} activeStep={2} />
        <div style={{ margin: '0 auto 1rem auto', width: '100%', maxWidth: '900px' }}>
          <h1>Qui est dans votre classe ?</h1>
          <SimpleActivityEditor />
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Dans cette activité, nous vous proposons de faire une présentation générale aux Pélicopains sur le thème de votre choix.
          </p>
          <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
            <Link href="/se-presenter/mascotte/4">
              <Button component="a" href="/se-presenter/mascotte/4" variant="outlined" color="primary">
                Étape suivante
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default MascotteStep3;
