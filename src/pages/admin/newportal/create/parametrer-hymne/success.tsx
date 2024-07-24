import Link from 'next/link';
import React from 'react';

import { Button } from '@mui/material';

import { PageLayout } from 'src/components/PageLayout';
import { bgPage } from 'src/styles/variables.const';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';

const AnthemSuccess = () => {
  return (
    <PageLayout>
      <div style={{ width: '100%', maxWidth: '20rem', margin: '4rem auto', backgroundColor: bgPage, padding: '1rem', borderRadius: '10px' }}>
        <p className="text">Votre hymne a bien été paramétré !</p>
        <PelicoSouriant style={{ width: '60%', height: 'auto', margin: '0 20%' }} />
      </div>
      <div className="text-center">
        <Link href="/" passHref>
          <Button component="a" href="/" variant="outlined" color="primary">
            Retour à l’accueil
          </Button>
        </Link>
      </div>
    </PageLayout>
  );
};

export default AnthemSuccess;
