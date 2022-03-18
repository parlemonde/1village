import classNames from 'classnames';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React from 'react';

import AddIcon from '@mui/icons-material/Add';
import { Grid, Button, TextField, Backdrop, CircularProgress, ButtonBase } from '@mui/material';

import { isStory } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { KeepRatio } from 'src/components/KeepRatio';
import { Steps } from 'src/components/Steps';
import { BackButton } from 'src/components/buttons/BackButton';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { primaryColor } from 'src/styles/variables.const';
import type { StoriesData } from 'types/story.type';

const StoryStep5 = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const data = (activity?.data as StoriesData) || null;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/creer-une-histoire');
    } else if (activity && !isStory(activity)) {
      router.push('/creer-une-histoire');
    }
  }, [activity, router]);

  const onPublish = async () => {
    setIsLoading(true);
    const success = await save(true);
    if (success) {
      router.push('/creer-une-histoire/success');
    }
    setIsLoading(false);
  };

  if (data === null || activity === null || !isStory(activity)) {
    return <div></div>;
  }

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
          {/* We have to add !isValid &&*/}
          <p>
            <b>Avant de publier votre présentation, il faut corriger les étapes incomplètes, marquées en orange.</b>
          </p>

          <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
            <Button variant="outlined" color="primary" onClick={onPublish}>
              Publier
            </Button>
          </div>

          {/* Object */}
          <div className={classNames('preview-block')}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <ButtonBase style={{ width: '100%', color: `${primaryColor}` }}>
                  <KeepRatio ratio={2 / 3} width="100%">
                    <div
                      style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        border: `1px solid ${primaryColor}`,
                        borderRadius: '10px',
                        justifyContent: 'center',
                      }}
                    >
                      {data?.object?.imageUrl ? (
                        <Image layout="fill" objectFit="contain" alt="image du plat" src={data?.object?.imageUrl} unoptimized />
                      ) : (
                        <AddIcon style={{ fontSize: '80px' }} />
                      )}
                    </div>
                  </KeepRatio>
                </ButtonBase>
              </Grid>
              <Grid item xs={12} md={6}>
                <EditButton
                  onClick={() => {
                    router.push(`/creer-une-histoire/1?edit=${activity.id}`);
                  }}
                  status={'success'}
                  style={{ position: 'absolute', top: '40%', right: '0.5rem' }}
                />
                <TextField
                  id="standard-multiline-static"
                  value={data?.object?.description || ''}
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
                <ButtonBase style={{ width: '100%', color: `${primaryColor}` }}>
                  <KeepRatio ratio={2 / 3} width="100%">
                    <div
                      style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        border: `1px solid ${primaryColor}`,
                        borderRadius: '10px',
                        justifyContent: 'center',
                      }}
                    >
                      {data?.place?.imageUrl ? (
                        <Image layout="fill" objectFit="contain" alt="image du plat" src={data?.place?.imageUrl} unoptimized />
                      ) : (
                        <AddIcon style={{ fontSize: '80px' }} />
                      )}
                    </div>
                  </KeepRatio>
                </ButtonBase>
              </Grid>
              <Grid item xs={12} md={6}>
                <EditButton
                  onClick={() => {
                    router.push(`/creer-une-histoire/2`);
                  }}
                  status={'success'}
                  style={{ position: 'absolute', top: '40%', right: '0.5rem' }}
                />
                <TextField
                  id="standard-multiline-static"
                  value={data?.place?.description || ''}
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
                <ButtonBase style={{ width: '100%', color: `${primaryColor}` }}>
                  <KeepRatio ratio={2 / 3} width="100%">
                    <div
                      style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        border: `1px solid ${primaryColor}`,
                        borderRadius: '10px',
                        justifyContent: 'center',
                      }}
                    >
                      {data?.odd?.imageUrl ? (
                        <Image layout="fill" objectFit="contain" alt="image du plat" src={data?.odd?.imageUrl} unoptimized />
                      ) : (
                        <AddIcon style={{ fontSize: '80px' }} />
                      )}
                    </div>
                  </KeepRatio>
                </ButtonBase>
              </Grid>
              <Grid item xs={12} md={6}>
                <EditButton
                  onClick={() => {
                    router.push(`/creer-une-histoire/3`);
                  }}
                  status={'success'}
                  style={{ position: 'absolute', top: '40%', right: '0.5rem' }}
                />
                <TextField
                  id="standard-multiline-static"
                  value={data?.odd?.description || ''}
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
                <ButtonBase style={{ width: '100%', color: `${primaryColor}` }}>
                  <KeepRatio ratio={2 / 3} width="100%">
                    <div
                      style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        border: `1px solid ${primaryColor}`,
                        borderRadius: '10px',
                        justifyContent: 'center',
                      }}
                    >
                      {data?.tale?.imageStory ? (
                        <Image layout="fill" objectFit="contain" alt="image du plat" src={data?.tale?.imageStory} unoptimized />
                      ) : (
                        <AddIcon style={{ fontSize: '80px' }} />
                      )}
                    </div>
                  </KeepRatio>
                </ButtonBase>
              </Grid>
              <Grid item xs={12} md={6}>
                <EditButton
                  onClick={() => {
                    router.push(`/creer-une-histoire/4`);
                  }}
                  status={'success'}
                  style={{ position: 'absolute', top: '40%', right: '0.5rem' }}
                />
                <TextField
                  id="standard-multiline-static"
                  value={data?.tale?.tale || ''}
                  rows={5}
                  multiline
                  variant="outlined"
                  style={{ width: '100%', marginTop: '10px', color: 'primary' }}
                />
              </Grid>
            </Grid>
          </div>
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default StoryStep5;
