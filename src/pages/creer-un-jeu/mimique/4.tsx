import { useRouter } from 'next/router';
import type { SourceProps } from 'react-player/base';
import ReactPlayer from 'react-player';
import React from 'react';

import { Grid, Button, Radio, RadioGroup, FormControlLabel, Backdrop, CircularProgress } from '@mui/material';

import { isGame } from 'src/activity-types/anyActivity';
import { isMimic } from 'src/activity-types/game.const';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { CustomRadio } from 'src/components/buttons/CustomRadio';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import type { MimicsData } from 'types/game.type';

const MimiqueStep4 = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const data = (activity?.data as MimicsData) || null;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/creer-un-jeu');
    } else if (activity && (!isGame(activity) || !isMimic(activity))) {
      router.push('/creer-un-jeu');
    }
  }, [activity, router]);

  const onPublish = async () => {
    setIsLoading(true);
    const success = await save(true);
    if (success) {
      router.push('/creer-un-jeu/success');
    }
    setIsLoading(false);
  };

  if (!activity) {
    return (
      <Base>
        <div></div>
      </Base>
    );
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={['1ère mimique', '2ème mimique', '3ème mimique', 'Prévisualiser']} activeStep={3} />
        <div className="width-900">
          <h1>Pré-visualisez votre mimiques et publiez les !</h1>
          <p style={{ width: '100%', textAlign: 'left', margin: '1rem 0' }}>
            Vous pouvez modifier chaque mimique si vous le souhaitez. Quand vous êtes prêts :
          </p>
          <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
            <Button variant="outlined" color="primary" onClick={onPublish}>
              Publier
            </Button>
          </div>
          {/* Mimique 1 */}
          <div className="preview-block">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <ReactPlayer
                  width="100%"
                  height="100%"
                  light
                  url={data.game1.video as string | string[] | SourceProps[] | MediaStream | undefined}
                  controls
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RadioGroup aria-label="signification" name="signification1" value={1}>
                  <FormControlLabel value={1} control={<CustomRadio isChecked isSuccess />} label={data.game1.signification} />
                  <FormControlLabel control={<Radio />} label={data.game1.fakeSignification1} />
                  <FormControlLabel control={<Radio />} label={data.game1.fakeSignification2} />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} md={2}>
                <EditButton
                  onClick={() => {
                    router.push(`/creer-un-jeu/mimique/1?edit=${activity.id}`);
                  }}
                  style={{ position: 'absolute', top: '40%', right: '0.5rem' }}
                />
              </Grid>
            </Grid>
            <p style={{ width: '100%', textAlign: 'left', margin: '0.3rem 1rem' }}>{data.game1.origine} </p>
          </div>
          {/* Mimique 2 */}
          <div className="preview-block">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <ReactPlayer
                  width="100%"
                  height="100%"
                  light
                  url={data.game2.video as string | string[] | SourceProps[] | MediaStream | undefined}
                  controls
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RadioGroup aria-label="signification" name="signification1" value={1}>
                  <FormControlLabel value={1} control={<CustomRadio isChecked isSuccess />} label={data.game2.signification} />
                  <FormControlLabel control={<Radio />} label={data.game2.fakeSignification1} />
                  <FormControlLabel control={<Radio />} label={data.game2.fakeSignification2} />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} md={2}>
                <EditButton
                  onClick={() => {
                    router.push('/creer-un-jeu/mimique/2');
                  }}
                  style={{ position: 'absolute', top: '40%', right: '0.5rem' }}
                />
              </Grid>
            </Grid>
            <p style={{ width: '100%', textAlign: 'left', margin: '0.3rem 1rem' }}>{data.game2.origine} </p>
          </div>
          {/* Mimique 3 */}
          <div className="preview-block">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <ReactPlayer
                  width="100%"
                  height="100%"
                  light
                  url={data.game3.video as string | string[] | SourceProps[] | MediaStream | undefined}
                  controls
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RadioGroup aria-label="signification" name="signification1" value={1}>
                  <FormControlLabel value={1} control={<CustomRadio isChecked isSuccess />} label={data.game3.signification} />
                  <FormControlLabel control={<Radio />} label={data.game3.fakeSignification1} />
                  <FormControlLabel control={<Radio />} label={data.game3.fakeSignification2} />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} md={2}>
                <EditButton
                  onClick={() => {
                    router.push('/creer-un-jeu/mimique/3');
                  }}
                  style={{ position: 'absolute', top: '40%', right: '0.5rem' }}
                />
              </Grid>
            </Grid>
            <p style={{ width: '100%', textAlign: 'left', margin: '0.3rem 1rem' }}>{data.game3.origine} </p>
          </div>
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default MimiqueStep4;
