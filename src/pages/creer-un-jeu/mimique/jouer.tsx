import { FormControlLabel, Grid, Radio, RadioGroup } from '@material-ui/core';
import React from 'react';
import ReactPlayer from 'react-player';
import { StepsButton } from 'src/components/StepsButtons';

import { Base } from 'src/components/Base';

const PlayMimique: React.FC = () => {
  const validate = () => {
    console.log('toto');
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <h1>Que signifie cette mimique ?</h1>
        <p>Une mimique proposée par la classe de CE2 à Ain El-Rihani</p>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ReactPlayer width="100%" height="100%" light url="" controls />
            <RadioGroup aria-label="gender" name="gender1" value="">
              <FormControlLabel value="0" control={<Radio />} label="toto1" />
              <FormControlLabel value="1" control={<Radio />} label="toto2" />
              <FormControlLabel value="2" control={<Radio />} label="toto3" />
            </RadioGroup>
          </Grid>
          <Grid item xs={12} md={6}></Grid>
        </Grid>
      </div>
      <StepsButton next={validate} />
    </Base>
  );
};

export default PlayMimique;
