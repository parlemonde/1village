import React from 'react';

import { TextField, Grid, Button } from '@mui/material';

import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import UploadIcon from 'src/svg/jeu/add-video.svg';

const StoryStep1 = () => {
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/creer-une-histoire" />
        <Steps
          steps={['Objet', 'Lieu', 'ODD', 'Histoire', 'Prévisualitation']}
          urls={['/creer-une-histoire/1?edit', '/creer-une-histoire/2', '/creer-une-histoire/3', '/creer-une-histoire/4', '/creer-une-histoire/5']}
          activeStep={0}
        />
        <div className="width-900">
          <h1>Inventez et dessinez un objet magique</h1>
          <p className="text">
            Cet objet, tout comme le lieu que vous choisirez à l’étape suivante, est magique ! Grâce à leurs pouvoirs, le village idéal a atteint
            l’objectif du développement durable que vous choisirez en étape 3.{' '}
          </p>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <div style={{ marginTop: '1.5rem' }}>
                <Button name="video" style={{ width: '100%' }} variant="outlined" color="primary">
                  {<UploadIcon style={{ width: '2rem', height: '6.23rem', margin: '30px' }} />}
                </Button>
                <span style={{ fontSize: '0.7rem', marginLeft: '1rem' }}>Ce champ est obligatoire</span>
              </div>
              <TextField
                id="standard-multiline-static"
                label="Décrivez l’objet magique"
                multiline
                variant="outlined"
                style={{ width: '100%', marginTop: '25px', color: 'primary' }}
                inputProps={{
                  maxLength: 400,
                }}
              />
              <div style={{ width: '100%', textAlign: 'right' }}>
                <span className="text text--small">/400</span>
              </div>
            </Grid>
          </Grid>
        </div>
        <StepsButton next="/creer-une-histoire/2" />
      </div>
    </Base>
  );
};
export default StoryStep1;
