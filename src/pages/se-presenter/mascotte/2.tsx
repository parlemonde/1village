import Link from 'next/link';
import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Button, TextField, Avatar, Grid, Box } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(18),
    height: theme.spacing(18),
  },
}));

const MascotteStep2: React.FC = () => {
  const { addContent } = React.useContext(ActivityContext);
  const classes = useStyles();
  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/se-presenter" />
        <Steps steps={['Votre classe', 'Votre mascotte', 'Description de votre mascotte', 'Prévisualiser']} activeStep={1} />
        <div style={{ margin: '0 auto 1rem auto', width: '100%', maxWidth: '900px' }}>
          <h1>Qui êtes-vous ? Choisissez une mascotte pour vous représenter collectivement !</h1>
          <div>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box display="flex" justifyContent="center" m={4}>
                  <Avatar alt="Ma Mascotte" className={classes.large}>
                    <AddIcon style={{ fontSize: '80px' }} />
                  </Avatar>
                </Box>
                <p>Images de votre mascotte</p>
              </Grid>
              <Grid item xs={12} md={9}>
                <p>Quel est le nom de votre mascotte ?</p>
                <TextField id="outlined-basic" label="nom" variant="outlined" />
                <p>Quel animal est votre mascotte et pourquoi l’avoir choisi ?</p>
                <TextField id="outlined-basic" label="description" multiline variant="outlined" style={{ width: '100%' }} />
                <p>3 traits de personnalités de votre mascotte (et donc des élèves !)</p>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField id="outlined-basic" label="1" variant="outlined" style={{ width: '100%' }} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField id="outlined-basic" label="2" variant="outlined" style={{ width: '100%' }} />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField id="outlined-basic" label="3" variant="outlined" style={{ width: '100%' }} />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
          <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
            <Link href="/se-presenter/mascotte/3">
              <Button component="a" href="/se-presenter/mascotte/3" variant="outlined" color="primary">
                Étape suivante
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Base>
  );
};

export default MascotteStep2;
