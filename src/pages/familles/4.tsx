import { Button } from '@mui/material';
import React from 'react';
import Base from 'react-player/base';

import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';

const ClassroomParamStep4 = () => {
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/contenu-libre" />
        <Steps
          steps={['Visibilité', 'Identifiants', 'Communication', 'Gestion']}
          urls={['/familles/1?edit', '/familles/2', '/familles/3', 'familles/4']}
          activeStep={3}
        />
        <div className="width-900">
          <h1> Vous pourrez bientôt visualiser sur cette page les familles qui ont activé leur compte. </h1>
          <p className="text"></p>
        </div>
        <Button type="submit" variant="outlined">
          Ajouter un élève
        </Button>
      </div>
    </Base>
  );
};

export default ClassroomParamStep4;
