import Link from 'next/link';
import React from 'react';

import { Button } from '@material-ui/core';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { ImageEditor } from 'src/components/activities/editors/ImageEditor';
import { SimpleActivityEditor } from 'src/components/activities';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';

const MascotteStep2: React.FC = () => {
  const { addContent } = React.useContext(ActivityContext);

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/se-presenter" />
        <Steps steps={['Votre classe', 'Votre mascotte', 'Description de votre mascotte', 'Prévisualiser']} activeStep={1} />
        <div style={{ margin: '0 auto 1rem auto', width: '100%', maxWidth: '900px' }}>
          <h1>Qui êtes-vous ? Choisissez une mascotte pour vous représenter collectivement !</h1>
          <div>
            <div style={{ margin: '0 auto 1rem auto', width: '20%', maxWidth: '900px' }}>
              <ImageEditor />
            </div>
            <div style={{ margin: '0 auto 1rem auto', width: '80%', maxWidth: '900px' }}>
              <p>Quel est le nom de votre mascotte ?</p>
              <SimpleActivityEditor />
            </div>
          </div>
          <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
            <Link href="/se-presenter/mascotte/3">
              <Button component="a" href="/se-presenter/mascotte/3" variant="outlined" color="primary">
                Étape suivante
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default MascotteStep2;
