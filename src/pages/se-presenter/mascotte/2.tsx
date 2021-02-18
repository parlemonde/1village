import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Button, TextField, Grid, Box } from '@material-ui/core';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { AvatarEditor } from 'src/components/activities/editors/ImageEditor/AvatarEditor';
import { BackButton } from 'src/components/buttons/BackButton';
import { ActivityContext } from 'src/contexts/activityContext';

const MascotteStep2: React.FC = () => {
  const router = useRouter();
  const { activity, updateActivity } = React.useContext(ActivityContext);
  const dataChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newData = { ...activity.data, [key]: event.target.value };
    updateActivity({ data: newData });
  };

  React.useEffect(() => {
    if (!activity) {
      router.push('/se-presenter/mascotte/1');
    }
  }, [activity, router]);

  if (!activity) router.push('/se-presenter/mascotte/1');

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <BackButton href="/se-presenter/mascotte/1" />
        <Steps steps={['Votre classe', 'Votre mascotte', 'Description de votre mascotte', 'Prévisualiser']} activeStep={1} />
        <div style={{ margin: '0 auto 1rem auto', width: '100%', maxWidth: '900px' }}>
          <h1>Qui êtes-vous ? Choisissez une mascotte pour vous représenter collectivement !</h1>
          <div>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box display="flex" justifyContent="center" m={4}>
                  <AvatarEditor onChange={dataChange('mascotteImage')} />
                </Box>
                <p>Images de votre mascotte</p>
              </Grid>
              <Grid item xs={12} md={9}>
                <p>Quel est le nom de votre mascotte ?</p>
                <TextField value={activity.data.mascotteName} onChange={dataChange('mascotteName')} label="nom" variant="outlined" />
                <p>Quel animal est votre mascotte et pourquoi l’avoir choisi ?</p>
                <TextField
                  value={activity.data.mascotteDescription}
                  onChange={dataChange('mascotteDescription')}
                  label="description"
                  multiline
                  variant="outlined"
                  style={{ width: '100%' }}
                />
                <p>3 traits de personnalités de votre mascotte (et donc des élèves !)</p>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      value={activity.data.personality1}
                      onChange={dataChange('personality1')}
                      label="1"
                      variant="outlined"
                      style={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      value={activity.data.personality2}
                      onChange={dataChange('personality2')}
                      label="2"
                      variant="outlined"
                      style={{ width: '100%' }}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      value={activity.data.personality3}
                      onChange={dataChange('personality3')}
                      label="3"
                      variant="outlined"
                      style={{ width: '100%' }}
                    />
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
