import { useRouter } from 'next/router';
import React from 'react';

import { Grid, Button, Radio, RadioGroup, FormControlLabel, RadioProps, Backdrop, CircularProgress } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';

import { MimiquesData } from 'types/game.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { ActivityContext } from 'src/contexts/activityContext';
import { EditButton } from 'src/components/buttons/EditButton';
import { isGame } from 'src/activity-types/anyActivity';
import { isMimique } from 'src/activity-types/game.const';
import ReactPlayer from 'react-player';
import { ActivityStatus } from 'types/activity.type';
import { BackButton } from 'src/components/buttons/BackButton';

const GreenRadio = withStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
  },
  checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);
const MimiqueStep4: React.FC = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const data = (activity?.data as MimiquesData) || null;

  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/creer-un-jeu');
    } else if (activity && (!isGame(activity) || !isMimique(activity))) {
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
                <ReactPlayer width="100%" height="100%" light url={data.mimique1.video} controls />
              </Grid>
              <Grid item xs={12} md={6}>
                <RadioGroup aria-label="signification" name="signification1" value={1}>
                  <FormControlLabel value={1} control={<GreenRadio />} label={data.mimique1.signification} />
                  <FormControlLabel control={<Radio />} label={data.mimique1.fakeSignification1} />
                  <FormControlLabel control={<Radio />} label={data.mimique1.fakeSignification2} />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} md={2}>
                <EditButton
                  onClick={() => {
                    router.push(`/creer-un-jeu/mimique/1?edit=${activity.id}`);
                  }}
                  isGreen
                  style={{ position: 'absolute', top: '40%', right: '0.5rem' }}
                />
              </Grid>
            </Grid>
            <p style={{ width: '100%', textAlign: 'left', margin: '0.3rem 1rem' }}>{data.mimique1.origine} </p>
          </div>
          {/* Mimique 2 */}
          <div className="preview-block">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <ReactPlayer width="100%" height="100%" light url={data.mimique2.video} controls />
              </Grid>
              <Grid item xs={12} md={6}>
                <RadioGroup aria-label="signification" name="signification1" value={1}>
                  <FormControlLabel value={1} control={<GreenRadio />} label={data.mimique2.signification} />
                  <FormControlLabel control={<Radio />} label={data.mimique2.fakeSignification1} />
                  <FormControlLabel control={<Radio />} label={data.mimique2.fakeSignification2} />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} md={2}>
                <EditButton
                  onClick={() => {
                    router.push('/creer-un-jeu/mimique/2');
                  }}
                  isGreen
                  style={{ position: 'absolute', top: '40%', right: '0.5rem' }}
                />
              </Grid>
            </Grid>
            <p style={{ width: '100%', textAlign: 'left', margin: '0.3rem 1rem' }}>{data.mimique2.origine} </p>
          </div>
          {/* Mimique 3 */}
          <div className="preview-block">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <ReactPlayer width="100%" height="100%" light url={data.mimique3.video} controls />
              </Grid>
              <Grid item xs={12} md={6}>
                <RadioGroup aria-label="signification" name="signification1" value={1}>
                  <FormControlLabel value={1} control={<GreenRadio />} label={data.mimique3.signification} />
                  <FormControlLabel control={<Radio />} label={data.mimique3.fakeSignification1} />
                  <FormControlLabel control={<Radio />} label={data.mimique3.fakeSignification2} />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} md={2}>
                <EditButton
                  onClick={() => {
                    router.push('/creer-un-jeu/mimique/3');
                  }}
                  isGreen
                  style={{ position: 'absolute', top: '40%', right: '0.5rem' }}
                />
              </Grid>
            </Grid>
            <p style={{ width: '100%', textAlign: 'left', margin: '0.3rem 1rem' }}>{data.mimique3.origine} </p>
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
