import React from 'react';

import { Grid, Button } from '@mui/material';

import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import ODDSelector from 'src/components/selectors/ODDSelector';
import UploadIcon from 'src/svg/jeu/add-video.svg';

const StoryStep3 = () => {
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/creer-une-histoire" />
        <Steps
          steps={['Objet', 'Lieu', 'ODD', 'Histoire', 'Prévisualitation']}
          urls={['/creer-une-histoire/1?edit', '/creer-une-histoire/2', '/creer-une-histoire/3', '/creer-une-histoire/4', '/creer-une-histoire/5']}
          activeStep={2}
        />
        <div className="width-900">
          <h1>Choisissez et dessinez l’objectif du développement durable atteint</h1>
          <p className="text">
            Grâce aux pouvoirs magiques de l’objet et du lieu choisis aux étapes précédentes, un des objectifs du développement durable a été atteint.
          </p>
          <p className="text">Choisissez lequel et dessinez-le.</p>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <div style={{ marginTop: '1.5rem' }}>
                <Button name="video" style={{ width: '100%' }} variant="outlined" color="primary">
                  {<UploadIcon style={{ width: '2rem', height: '6.23rem', margin: '30px' }} />}
                </Button>
                <span style={{ fontSize: '0.7rem', marginLeft: '1rem' }}>Ce champ est obligatoire</span>
                <ODDSelector label={'Choisissez votre ODD dans la liste'} />
              </div>
            </Grid>
          </Grid>
        </div>
        <StepsButton prev="/creer-une-histoire/2" next="/creer-une-histoire/4" />
      </div>
    </Base>
  );
};

export default StoryStep3;
