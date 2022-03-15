import React from 'react';

import { TextField, Grid, Button } from '@mui/material';

import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import UploadIcon from 'src/svg/jeu/add-video.svg';

const StoryStep4 = () => {
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/creer-une-histoire" />
        <Steps
          steps={['Objet', 'Lieu', 'ODD', 'Histoire', 'Prévisualitation']}
          urls={['/creer-une-histoire/1?edit', '/creer-une-histoire/2', '/creer-une-histoire/3', '/creer-une-histoire/4', '/creer-une-histoire/5']}
          activeStep={3}
        />
        <div className="width-900">
          <h1>Illustrez et écrivez l’histoire de votre visite dans le village idéal</h1>
          <p className="text">
            Racontez à vos Pélicopains, comment Pelico est parvenu à atteindre l’ODD choisi grâce à l’objet et au lieu magiques. Illustrez votre
            histoire avec un dessin de votre visite dans le village idéal.
          </p>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <div style={{ marginTop: '1.5rem' }}>
                <Button name="video" style={{ width: '100%' }} variant="outlined" color="primary">
                  {<UploadIcon style={{ width: '2rem', height: '6.23rem', margin: '30px' }} />}
                </Button>
                <span style={{ fontSize: '0.7rem', marginLeft: '1rem' }}>Ce champ est obligatoire</span>
              </div>
            </Grid>

            <TextField
              id="standard-multiline-static"
              label="Écrivez votre histoire du Village idéal"
              rows={6}
              multiline
              variant="outlined"
              style={{ width: '90%', marginTop: '25px', color: 'primary' }}
            />
          </Grid>
        </div>
        <StepsButton prev="/creer-une-histoire/3" next="/creer-une-histoire/5" />
      </div>
    </Base>
  );
};

export default StoryStep4;
