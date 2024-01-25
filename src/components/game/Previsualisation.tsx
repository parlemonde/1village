import classNames from 'classnames';
import router from 'next/router';
import React from 'react';
import ReactPlayer from 'react-player';

import { FormControlLabel, Grid, Radio, RadioGroup } from '@mui/material';

import { CustomRadio } from '../buttons/CustomRadio';
import { EditButton } from '../buttons/EditButton';
import { gameResponse } from 'src/contexts/gameContext';

const Previsualisation = () => {
  if (!gameResponse) {
    return <div>Loading...</div>;
  }
  console.log('game response', gameResponse);

  return (
    <>
      <div className={classNames('preview-block')}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ReactPlayer width="100%" height="100%" light controls />
          </Grid>
          <Grid item xs={12} md={8}>
            <RadioGroup aria-label="signification" name="signification1" value={1}>
              <FormControlLabel
                value={1}
                control={<CustomRadio isChecked isSuccess />}
                label={gameResponse.data[0].responses[1].value}
                style={{ maxWidth: '100%' }}
              />
              <FormControlLabel control={<CustomRadio />} label={'Valeur Brute 2'} style={{ maxWidth: '100%' }} />
              <FormControlLabel control={<CustomRadio />} label={'Valeur Brute 3'} style={{ maxWidth: '100%' }} />
              <Grid item xs={12} md={2}>
                <EditButton
                  onClick={() => {
                    router.push('/creer-un-jeu/monnaie/1');
                  }}
                  style={{ position: 'absolute', top: '40%', right: '0.5rem' }}
                />
              </Grid>
            </RadioGroup>
          </Grid>
        </Grid>
      </div>
      <div className={classNames('preview-block')}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ReactPlayer width="100%" height="100%" light controls />
          </Grid>
          <Grid item xs={12} md={8}>
            <RadioGroup aria-label="signification" name="signification1" value={1}>
              <FormControlLabel value={1} control={<CustomRadio isChecked isSuccess />} label={'Valeur Brute 1'} style={{ maxWidth: '100%' }} />
              <FormControlLabel control={<CustomRadio isChecked />} label={'Valeur Brute 2'} style={{ maxWidth: '100%' }} />
              <FormControlLabel control={<CustomRadio />} label={'Valeur Brute 3'} style={{ maxWidth: '100%' }} />
              <EditButton style={{ position: 'absolute', top: '40%', right: '0.5rem' }} />
            </RadioGroup>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default Previsualisation;
