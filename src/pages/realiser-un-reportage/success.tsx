import { Button } from '@mui/material';
import Link from 'next/link';
import React from 'react';

import { Base } from 'src/components/Base';
import { bgPage } from 'src/styles/variables.const';
import PelicoSouriant from 'src/svg/pelico/pelico-souriant.svg';

const ReportageSuccess = () => {
  return (
    <Base>
      <div style={{ width: '100%', padding: '1rem 1rem 1rem 1rem' }}>
        <div style={{ width: '100%', maxWidth: '20rem', margin: '4rem auto', backgroundColor: bgPage, padding: '1rem', borderRadius: '10px' }}>
          <p className="text" style={{ margin: '1rem 1.5rem' }}>
            Votre reportage a bien été publié !
          </p>
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

export default ReportageSuccess;
