import type { ChangeEventHandler } from 'react';
import React from 'react';

import { TextField, Grid, Button } from '@mui/material';

import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import UploadIcon from 'src/svg/jeu/add-video.svg';

const StorySelector = () => {
  return (
    <>
      <div className="width-900">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <div style={{ marginTop: '1.5rem' }}>
              <Button name="video" style={{ width: '100%' }} variant="outlined" color="primary">
                {<UploadIcon style={{ width: '3rem', height: '8rem', margin: '30px' }} />}
              </Button>
              <span style={{ fontSize: '0.7rem', marginLeft: '1rem' }}>Ce champ est obligatoire</span>
            </div>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              variant="outlined"
              label="Signification inventée 1"
              style={{ width: '100%', margin: '10px' }}
              inputProps={{
                maxLength: 800,
              }}
              multiline
            />
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default StorySelector;
