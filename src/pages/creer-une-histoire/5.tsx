import classNames from 'classnames';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Tooltip } from '@mui/material';
import { Grid, Button, Backdrop, CircularProgress, ButtonBase } from '@mui/material';

import { isStory } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { KeepRatio } from 'src/components/KeepRatio';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { getErrorSteps } from 'src/components/activities/storyChecks';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { bgPage, primaryColor, warningColor } from 'src/styles/variables.const';
import { ActivityStatus, ActivityType } from 'types/activity.type';
import type { StoriesData } from 'types/story.type';
import { UserType } from 'types/user.type';

const StoryStep5 = () => {
  const router = useRouter();
  const { activity, save, updateActivity } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const data = (activity?.data as StoriesData) || null;
  const isEdit = activity !== null && activity.status !== ActivityStatus.DRAFT;
  const isUserObservator = user?.type === UserType.OBSERVATOR;

  const errorSteps = React.useMemo(() => {
    const errors = [];
    if (data !== null) {
      if (getErrorSteps(data.object, 1).length > 0) {
        errors.push(0);
      }
      if (getErrorSteps(data.place, 2).length > 0) {
        errors.push(1);
      }
      if (getErrorSteps(data.odd, 3).length > 0) {
        errors.push(2);
      }
      if (getErrorSteps(data.tale, 4).length > 0) {
        errors.push(3);
      }
      return errors;
    }
    return [];
  }, [data]);

  const isValid = errorSteps.length === 0;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/creer-une-histoire');
    } else if (activity && !isStory(activity) && activity.type !== ActivityType.STORY) {
      router.push('/creer-une-histoire');
    }
  }, [activity, router]);

  // useEffect here to update inspiredStoryId if equal to 0
  React.useEffect(() => {
    if (data !== null && (data.object.inspiredStoryId === 0 || data.place.inspiredStoryId === 0 || data.odd.inspiredStoryId === 0)) {
      updateActivity({
        data: {
          ...data,
          object: { ...data.object, inspiredStoryId: activity?.id },
          place: { ...data.place, inspiredStoryId: activity?.id },
          odd: { ...data.odd, inspiredStoryId: activity?.id },
        },
      });
    }
  }, [activity?.id, data, updateActivity]);

  const onPublish = async () => {
    window.sessionStorage.setItem(`story-step-1-next`, 'false');
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
        <Steps
          steps={['Objet', 'Lieu', 'ODD', 'Histoire', 'Prévisualisation']}
          urls={['/creer-une-histoire/1?edit', '/creer-une-histoire/2', '/creer-une-histoire/3', '/creer-une-histoire/4', '/creer-une-histoire/5']}
          activeStep={4}
          errorSteps={errorSteps}
        />

        <div className="width-900">
          <h1>Pré-visualisez votre histoire{!isEdit && ', et publiez-la'}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            {isEdit
              ? " Vous pouvez la modifier à l'étape précédente, et enregistrer vos changements ici."
              : ' Vous pouvez la modifier, et quand vous êtes prêts : publiez-la dans votre village-monde !'}
          </p>

          {isEdit ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
              <Link href="/creer-une-histoire/2" passHref>
                <Button component="a" color="secondary" variant="contained" href="/creer-une-histoire/2">
                  {"Modifier à l'étape précédente"}
                </Button>
              </Link>
              <Button variant="outlined" color="primary" onClick={onPublish} disabled={isUserObservator || !isValid}>
                Enregistrer les changements
              </Button>
            </div>
          ) : (
            <>
              {!isValid && (
                <p>
                  <b>Avant de publier votre histoire, il faut corriger les étapes incomplètes, marquées en orange.</b>
                </p>
              )}
              <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
                {isUserObservator ? (
                  <Tooltip title="Action non autorisée" arrow>
                    <span>
                      <Button variant="outlined" color="primary" disabled>
                        Publier
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <Button variant="outlined" color="primary" onClick={onPublish} disabled={!isValid}>
                    Publier
                  </Button>
                )}
              </div>
            </>
          )}

          {/* Object */}
          <div className={classNames('preview-block')}>
            <Grid display="flex" direction="row" alignItems="center" spacing={2}>
              <EditButton
                onClick={() => {
                  router.push(`/creer-une-histoire/1?edit=${activity.id}`);
                }}
                status={errorSteps.includes(0) ? 'warning' : 'success'}
                style={{ position: 'absolute', top: '40%', right: '0.5rem' }}
              />
              <Grid item xs={12} md={4}>
                <ButtonBase style={{ width: '100%', pointerEvents: 'none' }}>
                  <KeepRatio ratio={2 / 3} width="100%">
                    <div
                      style={{
                        backgroundColor: bgPage,
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '0.5rem',
                        border: `1px solid ${!isValid && data.object?.imageUrl === '' ? warningColor : primaryColor}`,
                      }}
                    >
                      {data.object?.imageUrl && (
                        <Image layout="fill" objectFit="contain" alt="image de l'objet" src={data.object?.imageUrl} unoptimized />
                      )}
                    </div>
                  </KeepRatio>
                </ButtonBase>
              </Grid>
              <Grid item xs={12} md={8}>
                <div
                  className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(0) })}
                  style={{ margin: '0.5rem' }}
                >
                  <p>{data.object?.description || ''}</p>
                </div>
              </Grid>
            </Grid>
          </div>

          {/* Place */}
          <div className={classNames('preview-block')}>
            <Grid display="flex" direction="row" alignItems="center" spacing={2}>
              <EditButton
                onClick={() => {
                  router.push(`/creer-une-histoire/2`);
                }}
                status={errorSteps.includes(1) ? 'warning' : 'success'}
                style={{ position: 'absolute', top: '40%', right: '0.5rem' }}
              />
              <Grid item xs={12} md={4}>
                <ButtonBase style={{ width: '100%', pointerEvents: 'none' }}>
                  <KeepRatio ratio={2 / 3} width="100%">
                    <div
                      style={{
                        backgroundColor: bgPage,
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '0.5rem',
                        border: `1px solid ${!isValid && data.place?.imageUrl === '' ? warningColor : primaryColor}`,
                      }}
                    >
                      {data.place?.imageUrl && <Image layout="fill" objectFit="contain" alt="image du lieu" src={data.place?.imageUrl} unoptimized />}
                    </div>
                  </KeepRatio>
                </ButtonBase>
              </Grid>
              <Grid item xs={12} md={8}>
                <div
                  className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(1) })}
                  style={{ margin: '0.5rem' }}
                >
                  <p>{data.place?.description || ''}</p>
                </div>
              </Grid>
            </Grid>
          </div>

          {/* ODD */}
          <div className={classNames('preview-block')}>
            <Grid display="flex" direction="row" alignItems="center" spacing={2}>
              <EditButton
                onClick={() => {
                  router.push(`/creer-une-histoire/3`);
                }}
                status={errorSteps.includes(2) ? 'warning' : 'success'}
                style={{ position: 'absolute', top: '40%', right: '0.5rem' }}
              />
              <Grid item xs={12} md={4}>
                <ButtonBase style={{ width: '100%', pointerEvents: 'none' }}>
                  <KeepRatio ratio={2 / 3} width="100%">
                    <div
                      style={{
                        backgroundColor: bgPage,
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '0.5rem',
                        border: `1px solid ${!isValid && data.odd?.imageUrl === '' ? warningColor : primaryColor}`,
                      }}
                    >
                      {data.odd?.imageUrl && (
                        <Image
                          layout="fill"
                          objectFit="contain"
                          alt="image de l'objectif de développement durable"
                          src={data.odd?.imageUrl}
                          unoptimized
                        />
                      )}
                    </div>
                  </KeepRatio>
                </ButtonBase>
              </Grid>
              <Grid item xs={12} md={8}>
                <div
                  className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(2) })}
                  style={{ margin: '0.5rem' }}
                >
                  <p>{data.odd?.description || ''}</p>
                </div>
              </Grid>
            </Grid>
          </div>

          {/* Tale */}
          <div className={classNames('preview-block')}>
            <Grid display="flex" direction="row" alignItems="center" spacing={2}>
              <EditButton
                onClick={() => {
                  router.push(`/creer-une-histoire/4`);
                }}
                status={errorSteps.includes(3) ? 'warning' : 'success'}
                style={{ position: 'absolute', top: '40%', right: '0.5rem' }}
              />
              <Grid item xs={12} md={4}>
                <ButtonBase style={{ width: '100%', pointerEvents: 'none' }}>
                  <KeepRatio ratio={2 / 3} width="100%">
                    <div
                      style={{
                        backgroundColor: bgPage,
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '0.5rem',
                        border: `1px solid ${!isValid && data.tale?.imageStory === '' ? warningColor : primaryColor}`,
                      }}
                    >
                      {data.tale?.imageStory && (
                        <Image layout="fill" objectFit="contain" alt="image de l'histoire" src={data.tale?.imageStory} unoptimized />
                      )}
                    </div>
                  </KeepRatio>
                </ButtonBase>
              </Grid>
              <Grid item xs={12} md={8}>
                <div
                  className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(3) })}
                  style={{ margin: '0.5rem' }}
                >
                  <p>{data.tale?.tale || ''}</p>
                </div>
              </Grid>
            </Grid>
          </div>
          <StepsButton prev="/creer-une-histoire/4" />
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default StoryStep5;
