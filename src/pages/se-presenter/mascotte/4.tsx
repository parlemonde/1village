import { useRouter } from 'next/router';
import { useQueryCache } from 'react-query';
import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, Grid, Backdrop, Box } from '@material-ui/core';

import { isPresentation } from 'src/activities/anyActivity';
import { getMascotteContent, isMascotte } from 'src/activities/presentation.const';
import { MascotteData } from 'src/activities/presentation.types';
import { AvatarImg } from 'src/components/Avatar';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { useCountries } from 'src/services/useCountries';
import { useCurrencies } from 'src/services/useCurrencies';
import { useLanguages } from 'src/services/useLanguages';
import { ActivityStatus } from 'types/activity.type';
import { User } from 'types/user.type';

const MascotteStep4: React.FC = () => {
  const router = useRouter();
  const queryCache = useQueryCache();
  const { user, setUser, axiosLoggedRequest } = React.useContext(UserContext);
  const { activity, save, updateActivity } = React.useContext(ActivityContext);
  const { countries } = useCountries();
  const { languages } = useLanguages();
  const { currencies } = useCurrencies();
  const [isLoading, setIsLoading] = React.useState(false);

  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const data = (activity?.data as MascotteData) || null;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/se-presenter');
    } else if (activity && (!isPresentation(activity) || !isMascotte(activity))) {
      router.push('/se-presenter');
    }
  }, [activity, router, updateActivity]);

  const content = React.useMemo(() => (data === null ? ['', '', ''] : getMascotteContent(data, countries, currencies, languages)), [
    data,
    countries,
    languages,
    currencies,
  ]);

  const prevContent = React.useRef<string[] | null>(null);
  React.useEffect(() => {
    if (!activity || prevContent.current === content) {
      return;
    }
    prevContent.current = content;
    const newContent = [...activity.processedContent];
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
    updateActivity({ processedContent: newContent });
  }, [activity, content, updateActivity]);

  const onPublish = async () => {
    setIsLoading(true);
    const success = await save(true);
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
        queryCache.invalidateQueries('users');
        queryCache.invalidateQueries('village-users');
      }
      router.push('/se-presenter/success');
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
          steps={['Votre classe', 'Votre mascotte : ' + data.mascotteName ?? 'mascotteName', 'Description de votre mascotte', 'Prévisualiser']}
          activeStep={3}
        />
        <div className="width-900">
          <h1>Pré-visualisez votre mascotte{!isEdit && ' et publiez la'}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Voici la pré-visualisation de votre présentation.
            {isEdit
              ? " Vous pouvez la modifier à l'étape précédente, et enregistrer vos changements ici."
              : ' Vous pouvez la modifier, et quand vous êtes prêts : publiez-la dans votre village-monde !'}
          </p>
          {isEdit ? (
            <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
              <Button variant="outlined" color="primary" onClick={onPublish}>
                Enregistrer les changements
              </Button>
            </div>
          ) : (
            <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
              <Button variant="outlined" color="primary" onClick={onPublish}>
                Publier
              </Button>
            </div>
          )}
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/se-presenter/mascotte/1');
              }}
              isGreen
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <div>
              {content.length > 0 &&
                content[0].split('\n').map((s, index) => (
                  <p key={index} style={{ margin: '0.5rem 0' }}>
                    {s}
                  </p>
                ))}
            </div>
          </div>
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/se-presenter/mascotte/2');
              }}
              isGreen
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Box display="flex" justifyContent="center" m={0}>
                  <AvatarImg src={data.mascotteImage} />
                </Box>
              </Grid>
              <Grid item xs={12} md={9}>
                <div>
                  {content.length > 1 &&
                    content[1].split('\n').map((s, index) => (
                      <p key={index} style={{ margin: '0.5rem 0' }}>
                        {s}
                      </p>
                    ))}
                </div>
              </Grid>
            </Grid>
          </div>
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/se-presenter/mascotte/3');
              }}
              isGreen
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

          <StepsButton prev="/se-presenter/mascotte/3" />
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default MascotteStep4;
