import { Button } from '@mui/material';
import Link from 'next/link';
import React from 'react';

import { isMascotte } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { ActivityContext } from 'src/contexts/activityContext';
import { bgPage } from 'src/styles/variables.const';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';

const PresentationSuccess = () => {
  const { activity } = React.useContext(ActivityContext);
  const isMascotteActivity = activity && isMascotte(activity);

  return (
    <Base>
      <div style={{ width: '100%', padding: '1rem 1rem 1rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: '20rem', margin: '4rem auto', backgroundColor: bgPage, padding: '1rem', borderRadius: '10px' }}>
          <p className="text">{isMascotteActivity ? 'Votre mascotte a bien été publiée !' : 'Votre présentation a bien été publiée !'}</p>
          <PelicoSouriant style={{ width: '60%', height: 'auto', margin: '0 20%' }} />
        </div>
        <div className="text-center">
          <Link href="/" passHref>
            <Button component="a" href="/" variant="outlined" color="primary">
              Retour à l’accueil
            </Button>
          </Link>
        </div>
      </div>
    </Base>
  );
};

export default PresentationSuccess;
