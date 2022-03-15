import classNames from 'classnames';
import { useRouter } from 'next/router';
import React from 'react';

import { Grid, Button, TextField, RadioGroup, FormControlLabel, Backdrop, CircularProgress, Tooltip } from '@mui/material';

import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { EditButton } from 'src/components/buttons/EditButton';
import UploadIcon from 'src/svg/jeu/add-video.svg';

const StoryStep5 = () => {
  const router = useRouter();

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/creer-une-histoire" />
        <Steps
          steps={['Objet', 'Lieu', 'ODD', 'Histoire', 'Prévisualitation']}
          urls={['/creer-une-histoire/1?edit', '/creer-une-histoire/2', '/creer-une-histoire/3', '/creer-une-histoire/4', '/creer-une-histoire/5']}
          activeStep={4}
        />

        <div className="width-900">
          <h1>Pré-visualisez votre histoire et publiez-la.</h1>
          <p style={{ width: '100%', textAlign: 'left', margin: '1rem 0' }}>
            Voici la pré-visualisation de votre histoire. Vous pouvez la modifier, et quand vous êtes prêts : publiez-la dans votre village-monde !
          </p>
          <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
            <Button variant="outlined" color="primary">
              Publier
            </Button>
          </div>

          {/* Object */}
          <div className={classNames('preview-block')}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Button name="video" style={{ width: '100%' }} variant="outlined" color="primary">
                  {<UploadIcon style={{ width: '2rem', height: '6.23rem', margin: '30px' }} />}
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <EditButton status={'success'} style={{ position: 'absolute', top: '40%', right: '0.5rem' }} />
                <TextField
                  id="standard-multiline-static"
                  label="Inventez et dessinez un objet magique"
                  multiline
                  variant="outlined"
                  style={{ width: '100%', marginTop: '50px', color: 'primary' }}
                  inputProps={{
                    maxLength: 400,
                  }}
                />
              </Grid>
            </Grid>
          </div>

          {/* Place */}
          <div className={classNames('preview-block')}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Button name="video" style={{ width: '100%' }} variant="outlined" color="primary">
                  {<UploadIcon style={{ width: '2rem', height: '6.23rem', margin: '30px' }} />}
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <EditButton status={'success'} style={{ position: 'absolute', top: '40%', right: '0.5rem' }} />
                <TextField
                  id="standard-multiline-static"
                  label="Décrivez le lieu extraordinaire"
                  multiline
                  variant="outlined"
                  style={{ width: '100%', marginTop: '50px', color: 'primary' }}
                  inputProps={{
                    maxLength: 400,
                  }}
                />
              </Grid>
            </Grid>
          </div>

          {/* ODD */}
          <div className={classNames('preview-block')}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Button name="video" style={{ width: '100%' }} variant="outlined" color="primary">
                  {<UploadIcon style={{ width: '2rem', height: '6.23rem', margin: '30px' }} />}
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <EditButton status={'success'} style={{ position: 'absolute', top: '40%', right: '0.5rem' }} />
                <TextField
                  id="standard-multiline-static"
                  label="Choisissez et dessinez l’objectif du développement durable atteint"
                  multiline
                  variant="outlined"
                  style={{ width: '100%', marginTop: '50px', color: 'primary' }}
                  inputProps={{
                    maxLength: 400,
                  }}
                />
              </Grid>
            </Grid>
          </div>

          {/* Tale */}
          <div className={classNames('preview-block')}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Button name="video" style={{ width: '100%' }} variant="outlined" color="primary">
                  {<UploadIcon style={{ width: '2rem', height: '6.23rem', margin: '30px' }} />}
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <EditButton status={'success'} style={{ position: 'absolute', top: '40%', right: '0.5rem' }} />
                <TextField
                  id="standard-multiline-static"
                  label="Écrivez votre histoire du Village idéal"
                  rows={5}
                  multiline
                  variant="outlined"
                  style={{ width: '100%', marginTop: '10px', color: 'primary' }}
                  inputProps={{
                    maxLength: 400,
                  }}
                />
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default StoryStep5;
