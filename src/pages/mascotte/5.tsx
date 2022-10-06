import classNames from 'classnames';
import { useRouter } from 'next/router';
import React from 'react';
import { useQueryClient } from 'react-query';

import { Button, Grid, Backdrop, Box, Tooltip } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

import { isMascotte } from 'src/activity-types/anyActivity';
import { getMascotteContent } from 'src/activity-types/mascotte.constants';
import type { MascotteData } from 'src/activity-types/mascotte.types';
import { AvatarImg } from 'src/components/Avatar';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ImageView } from 'src/components/activities/content/views/ImageView';
import { getErrorSteps } from 'src/components/activities/mascotteChecks';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { useCountries } from 'src/services/useCountries';
import { useCurrencies } from 'src/services/useCurrencies';
import { useLanguages } from 'src/services/useLanguages';
import { ActivityStatus } from 'types/activity.type';
import type { User } from 'types/user.type';
import { UserType } from 'types/user.type';

const MascotteStep5 = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setUser, axiosLoggedRequest } = React.useContext(UserContext);
  const { activity, save, updateActivity } = React.useContext(ActivityContext);
  const { countries } = useCountries();
  const { languages } = useLanguages();
  const { currencies } = useCurrencies();
  const [isLoading, setIsLoading] = React.useState(false);

  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  // const isObservator = user?.type === UserType.OBSERVATOR;
  // const isMediator = user?.type === UserType.MEDIATOR;
  const isTeacher = user?.type === UserType.TEACHER;
  const data = (activity?.data as MascotteData) || null;
  const errorSteps = React.useMemo(() => {
    if (data !== null) {
      return getErrorSteps(data, 4);
    }
    return [];
  }, [data]);
  const isValid = errorSteps.length === 0;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/ma-classe');
    } else if (activity && !isMascotte(activity)) {
      router.push('/ma-classe');
    }
  }, [activity, router, updateActivity]);

  const content = React.useMemo(
    () => (data === null ? ['', '', ''] : getMascotteContent(data, countries, currencies, languages)),
    [data, countries, languages, currencies],
  );

  const prevContent = React.useRef<string[] | null>(null);
  React.useEffect(() => {
    if (!activity || prevContent.current === content) {
      return;
    }
    prevContent.current = content;
    const newContent = [...activity.content];
    // 1
    if (newContent.length > 0 && content.length > 0) {
      newContent[0].value = content[0];
    } else if (content.length > 0) {
      newContent.push({
        type: 'text',
        value: content[0],
        id: 1,
      });
    }

    // 2
    if (newContent.length > 1 && content.length > 1) {
      newContent[1].value = content[1];
    } else if (content.length > 1) {
      newContent.push({
        type: 'text',
        value: content[1],
        id: 2,
      });
    }

    // 3
    if (newContent.length > 2 && content.length > 2) {
      newContent[2].value = content[2];
    } else if (content.length > 2) {
      newContent.push({
        type: 'text',
        value: content[2],
        id: 3,
      });
    }
    updateActivity({ content: newContent });
  }, [activity, content, updateActivity]);

  const onPublish = async () => {
    if (!activity || !user || !isValid) {
      return;
    }
    setIsLoading(true);
    const { success } = await save(true);
    if (success) {
      const newUser: Partial<User> = {};
      if ((activity.data as MascotteData).mascotteImage) {
        newUser.avatar = (activity.data as MascotteData).mascotteImage;
      }
      newUser.displayName = (activity.data as MascotteData).presentation;
      const response = await axiosLoggedRequest({
        method: 'PUT',
        url: `/users/${user?.id}`,
        data: newUser,
      });
      if (!response.error) {
        setUser({ ...user, ...newUser });
        queryClient.invalidateQueries('users');
        queryClient.invalidateQueries('village-users');
      }
      router.push('/se-presenter/success');
    }
    setIsLoading(false);
  };

  return (
    activity && (
      <Base>
        <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
          <Steps
            steps={[
              'Votre classe',
              `${data.mascotteName ? data.mascotteName : 'Votre mascotte'}`,
              'Langues et monnaies',
              'Le web de Pelico',
              'Prévisualiser',
            ]}
            urls={['/mascotte/1?edit', '/mascotte/2', '/mascotte/3', '/mascotte/4', '/mascotte/5']}
            activeStep={4}
            errorSteps={errorSteps}
          />
          <div className="width-900">
            <h1>Pré-visualisez votre mascotte{!isEdit && ' et publiez la'}</h1>
            <p className="text" style={{ fontSize: '1.1rem' }}>
              Voici la pré-visualisation de votre présentation.
              {isEdit
                ? " Vous pouvez la modifier à l'étape précédente, et enregistrer vos changements ici."
                : ' Vous pouvez la modifier, et quand vous êtes prêts : publiez-la dans votre village-monde !'}
            </p>
            {!isValid && (
              <p>
                <b>Avant de publier votre présentation, il faut corriger les étapes incomplètes, marquées en orange.</b>
              </p>
            )}
            {isEdit ? (
              <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
                <Button variant="outlined" color="primary" onClick={onPublish} disabled={!isTeacher}>
                  Enregistrer les changements
                </Button>
              </div>
            ) : (
              <>
                <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
                  {!isTeacher ? (
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
            <div className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(0) })}>
              <EditButton
                onClick={() => {
                  router.push('/mascotte/1');
                }}
                status={errorSteps.indexOf(0) !== -1 ? 'warning' : 'success'}
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
              />
              <div>
                {errorSteps.indexOf(0) === -1 &&
                  content.length > 0 &&
                  content[0].split('\n').map((s, index) => (
                    <p key={index} style={{ margin: '0.5rem 0' }}>
                      {s}
                    </p>
                  ))}
                {data?.classImg && (
                  <>
                    <ImageView id={1} value={data?.classImg} key={1} />
                    <p>{data?.classImgDesc}</p>
                  </>
                )}
              </div>
            </div>
            <div className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(1) })}>
              <EditButton
                onClick={() => {
                  router.push('/mascotte/2');
                }}
                status={errorSteps.indexOf(1) !== -1 ? 'warning' : 'success'}
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
              />
              <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                  <Box display="flex" justifyContent="center" m={0}>
                    <AvatarImg src={data?.mascotteImage} noLink />
                  </Box>
                </Grid>
                <Grid item xs={12} md={9}>
                  <div>
                    {errorSteps.indexOf(1) === -1 &&
                      content.length > 1 &&
                      content[1].split('\n').map((s, index) => (
                        <p key={index} style={{ margin: '0.5rem 0' }}>
                          {s}
                        </p>
                      ))}
                  </div>
                </Grid>
              </Grid>
            </div>
            <div className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(2) })}>
              <EditButton
                onClick={() => {
                  router.push('/mascotte/3');
                }}
                status={errorSteps.indexOf(2) !== -1 ? 'warning' : 'success'}
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
              />
              <div>
                {content.length > 2 &&
                  content[2].split('\n').map((s, index) => (
                    <p key={index} style={{ margin: '0.5rem 0' }}>
                      {s}
                    </p>
                  ))}
              </div>
            </div>

            <StepsButton prev="/mascotte/4" />
          </div>
        </div>
        <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Base>
    )
  );
};

export default MascotteStep5;
