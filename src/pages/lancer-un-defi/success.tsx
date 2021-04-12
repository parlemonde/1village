import Link from 'next/link';
import React from 'react';

import { Button } from '@material-ui/core';

import { Base } from 'src/components/Base';
import { bgPage } from 'src/styles/variables.const';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';

const ChallengeSuccess: React.FC = () => {
  return (
    <Base>
      <div style={{ width: '100%', padding: '1rem 1rem 1rem 1rem' }}>
        <div
          className="text-center"
          style={{ width: '100%', maxWidth: '20rem', margin: '4rem auto', backgroundColor: bgPage, padding: '1rem', borderRadius: '10px' }}
        >
          <p className="text">Votre défi a bien été publié !</p>
          <PelicoSouriant style={{ width: '60%', height: 'auto', margin: '0 20%' }} />
        </div>
        <div className="text-center">
          <Link href="/">
            <Button component="a" href="/" variant="outlined" color="primary">
              Retour à l’accueil
            </Button>
          </Link>
        </div>
      </div>
    </Base>
  );
};

export default ChallengeSuccess;
