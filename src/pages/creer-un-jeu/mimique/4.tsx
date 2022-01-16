import classNames from 'classnames';
import { useRouter } from 'next/router';
import type { SourceProps } from 'react-player/base';
import ReactPlayer from 'react-player';
import React from 'react';

import { Grid, Button, Radio, RadioGroup, FormControlLabel, Backdrop, CircularProgress } from '@mui/material';

import { isGame } from 'src/activity-types/anyActivity';
import { isMimic, isMimicValid } from 'src/activity-types/game.constants';
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

  const errorSteps = React.useMemo(() => {
    const errors: number[] = [];
    if (data === undefined || data === null) return; //when you came from ma-classe.tsx
    if (!isMimicValid(data.game1)) errors.push(0); // step of mimic 1
    if (!isMimicValid(data.game2)) errors.push(1); // step of mimic 2
    if (!isMimicValid(data.game3)) errors.push(2); // step of mimic 3
    return errors;
  }, [data]);

  const isValid = errorSteps?.length === 0;

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
        <Steps
          steps={['1ère mimique', '2ème mimique', '3ème mimique', 'Prévisualiser']}
          urls={['/creer-un-jeu/mimique/1?edit', '/creer-un-jeu/mimique/2', '/creer-un-jeu/mimique/3', '/creer-un-jeu/mimique/4']}
          activeStep={3}
          errorSteps={errorSteps}
        />

        <div className="width-900">
          <h1>Pré-visualisez votre mimiques et publiez les !</h1>
          <p style={{ width: '100%', textAlign: 'left', margin: '1rem 0' }}>
            Vous pouvez modifier chaque mimique si vous le souhaitez. Quand vous êtes prêts :
          </p>
          {!isValid && (
            <p>
              <b>Avant de publier votre présentation, il faut corriger les étapes incomplètes, marquées en orange.</b>
            </p>
          )}
          <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
            <Button variant="outlined" color="primary" onClick={onPublish} disabled={!isValid}>
              Publier
            </Button>
          </div>
          {/* Mimique 1 */}
          <div className={classNames('preview-block', { 'preview-block--warning': errorSteps?.includes(0) })}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <ReactPlayer
                  width="100%"
                  height="100%"
                  light
                  url={errorSteps?.includes(0) ? ' ' : (data.game1.video as string | string[] | SourceProps[] | MediaStream | undefined)}
                  controls
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RadioGroup aria-label="signification" name="signification1" value={1}>
                  <FormControlLabel
                    value={1}
                    control={<CustomRadio isChecked isSuccess />}
                    label={errorSteps?.includes(0) ? '' : data.game1.signification || ''}
                  />
                  <FormControlLabel control={<Radio />} label={errorSteps?.includes(0) ? '' : data.game1.fakeSignification1 || ''} />
                  <FormControlLabel control={<Radio />} label={errorSteps?.includes(0) ? '' : data.game1.fakeSignification2 || ''} />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} md={2}>
                <EditButton
                  onClick={() => {
                    router.push(`/creer-un-jeu/mimique/1?edit=${activity.id}`);
                  }}
                  status={errorSteps?.includes(0) ? 'warning' : 'success'}
                  style={{ position: 'absolute', top: '40%', right: '0.5rem' }}
                />
              </Grid>
            </Grid>
            <p style={{ width: '100%', textAlign: 'left', margin: '0.3rem 1rem' }}>{data.game1.origine} </p>
          </div>
          {/* Mimique 2 */}
          <div className={classNames('preview-block', { 'preview-block--warning': errorSteps?.includes(1) })}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <ReactPlayer
                  width="100%"
                  height="100%"
                  light
                  url={errorSteps?.includes(1) ? ' ' : (data.game2.video as string | string[] | SourceProps[] | MediaStream | undefined)}
                  controls
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RadioGroup aria-label="signification" name="signification1" value={1}>
                  <FormControlLabel
                    value={1}
                    control={<CustomRadio isChecked isSuccess />}
                    label={errorSteps?.includes(1) ? '' : data.game2.signification || ''}
                  />
                  <FormControlLabel control={<Radio />} label={errorSteps?.includes(1) ? '' : data.game2.fakeSignification1 || ''} />
                  <FormControlLabel control={<Radio />} label={errorSteps?.includes(1) ? '' : data.game2.fakeSignification2 || ''} />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} md={2}>
                <EditButton
                  onClick={() => {
                    router.push('/creer-un-jeu/mimique/2');
                  }}
                  status={errorSteps?.includes(1) ? 'warning' : 'success'}
                  style={{ position: 'absolute', top: '40%', right: '0.5rem' }}
                />
              </Grid>
            </Grid>
            <p style={{ width: '100%', textAlign: 'left', margin: '0.3rem 1rem' }}>{data.game2.origine} </p>
          </div>
          {/* Mimique 3 */}
          <div className={classNames('preview-block', { 'preview-block--warning': errorSteps?.includes(2) })}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <ReactPlayer
                  width="100%"
                  height="100%"
                  light
                  url={errorSteps?.includes(2) ? ' ' : (data.game3.video as string | string[] | SourceProps[] | MediaStream | undefined)}
                  controls
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <RadioGroup aria-label="signification" name="signification1" value={1}>
                  <FormControlLabel
                    value={1}
                    control={<CustomRadio isChecked isSuccess />}
                    label={errorSteps?.includes(2) ? '' : data.game3.signification || ''}
                  />
                  <FormControlLabel control={<Radio />} label={errorSteps?.includes(2) ? '' : data.game3.fakeSignification1 || ''} />
                  <FormControlLabel control={<Radio />} label={errorSteps?.includes(2) ? '' : data.game3.fakeSignification2 || ''} />
                </RadioGroup>
              </Grid>
              <Grid item xs={12} md={2}>
                <EditButton
                  onClick={() => {
                    router.push('/creer-un-jeu/mimique/3');
                  }}
                  status={errorSteps?.includes(2) ? 'warning' : 'success'}
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
