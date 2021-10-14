import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import { Button, Grid, Backdrop, Box } from '@material-ui/core';

import { isPresentation } from 'src/activity-types/anyActivity';
import { getMascotteContent, isMascotte } from 'src/activity-types/presentation.constants';
import type { MascotteData } from 'src/activity-types/presentation.types';
import { AvatarImg } from 'src/components/Avatar';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ImageView } from 'src/components/activities/content/views/ImageView';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { useCountries } from 'src/services/useCountries';
import { useCurrencies } from 'src/services/useCurrencies';
import { useLanguages } from 'src/services/useLanguages';
import { errorColor, successColor } from 'src/styles/variables.const';
import { ActivityStatus } from 'types/activity.type';
import type { User } from 'types/user.type';

const MascotteStep4 = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, setUser, axiosLoggedRequest } = React.useContext(UserContext);
  const { activity, save, updateActivity } = React.useContext(ActivityContext);
  const [errorSteps, setErrorSteps] = React.useState([]);
  const { countries } = useCountries();
  const { languages } = useLanguages();
  const { currencies } = useCurrencies();
  const [isLoading, setIsLoading] = React.useState(false);

  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const data = (activity?.data as MascotteData) || null;

  const isValidSum = (x: number, y: number, z: number) => {
    if (x < 0 || y < 0) return false;
    return x + y === z;
  };

  const isFirstStepValid = () => {
    return (
      data?.presentation.length > 0 &&
      isValidSum(data?.girlStudent, data?.boyStudent, data?.totalStudent) &&
      isValidSum(data?.womanTeacher, data?.manTeacher, data?.totalTeacher) &&
      data?.totalStudent !== 0 &&
      data?.totalTeacher !== 0 &&
      data?.totalStudent !== null &&
      data?.totalTeacher !== null &&
      data?.numberClassroom !== 0 &&
      data?.numberClassroom !== null &&
      data?.totalSchoolStudent !== 0 &&
      data?.totalSchoolStudent !== null &&
      data?.meanAge !== 0 &&
      data?.meanAge !== null
    );
  };

  const isSecondStepValid = (): boolean => {
    if (data?.mascotteName === '') return false;
    if (data?.mascotteDescription === '') return false;
    if (data?.personality1 === '') return false;
    if (data?.personality2 === '') return false;
    if (data?.personality3 === '') return false;
    if (data?.countries === []) return false;
    if (data?.game === '') return false;
    if (data?.sport === '') return false;
    return true;
  };

  React.useEffect(() => {
    !isFirstStepValid() && !isSecondStepValid()
      ? setErrorSteps([0, 1])
      : !isFirstStepValid()
      ? setErrorSteps([1])
      : !isSecondStepValid() && setErrorSteps([0]);
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/ma-classe');
    } else if (activity && (!isPresentation(activity) || !isMascotte(activity))) {
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
              `${data?.presentation ? data?.presentation : 'Votre mascotte'}`,
              'Langues et monnaies',
              'Le web de Pelico',
              'Prévisualiser',
            ]}
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
            {isEdit ? (
              <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
                <Button variant="outlined" color="primary" onClick={onPublish}>
                  Enregistrer les changements
                </Button>
              </div>
            ) : (
              <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
                <Button variant="outlined" color="primary" onClick={onPublish} disabled={errorSteps.length > 0}>
                  Publier
                </Button>
              </div>
            )}
            <div className="preview-block" style={{ border: `1px dashed ${!isFirstStepValid() ? errorColor : successColor}` }}>
              <EditButton
                onClick={() => {
                  router.push('/mascotte/1');
                }}
                status={!isFirstStepValid() ? 'error' : 'success'}
                style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
              />
              <div>
                {isFirstStepValid() &&
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
            <div className="preview-block" style={{ border: `1px dashed ${!isSecondStepValid() ? errorColor : successColor}` }}>
              <EditButton
                onClick={() => {
                  router.push('/mascotte/2');
                }}
                status={!isSecondStepValid() ? 'error' : 'success'}
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
                    {isSecondStepValid() &&
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
            <div className="preview-block">
              <EditButton
                onClick={() => {
                  router.push('/mascotte/3');
                }}
                status={'success'}
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

export default MascotteStep4;
