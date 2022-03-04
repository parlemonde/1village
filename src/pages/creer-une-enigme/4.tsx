import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Tooltip } from '@mui/material';

import { isEnigme } from 'src/activity-types/anyActivity';
import { ENIGME_TYPES, getCategoryName, getSubcategoryName } from 'src/activity-types/enigme.constants';
import type { EnigmeData } from 'src/activity-types/enigme.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ContentView } from 'src/components/activities/content/ContentView';
import { getErrorSteps } from 'src/components/activities/enigmeChecks';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { ActivityStatus } from 'types/activity.type';
import { UserType } from 'types/user.type';

const EnigmeStep4 = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const data = (activity?.data as EnigmeData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const isUserObservator = user?.type === UserType.OBSERVATOR;
  const indiceContentIndex = data?.indiceContentIndex ?? 0;

  const errorSteps = React.useMemo(() => {
    const fieldStep2 = activity?.content
      .slice(indiceContentIndex - 1, activity.content.length)
      .filter((d) => d.value !== '' && d.value !== '<p></p>\n'); // if value is empty in step 2
    const fieldStep3 = activity?.content.slice(indiceContentIndex, activity.content.length).filter((d) => d.value !== '' && d.value !== '<p></p>\n'); // if value is empty in step 3
    if (data !== null) {
      const errors = getErrorSteps(data, 1);
      if (fieldStep2?.length === 0) errors.push(1); //corresponding to step 2
      if (fieldStep3?.length === 0) errors.push(2); //corresponding to step 3
      return errors;
    }

    return [];
  }, [activity?.content, data, indiceContentIndex]);
  const isValid = errorSteps.length === 0;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/creer-une-enigme');
    } else if (activity && !isEnigme(activity)) {
      router.push('/creer-une-enigme');
    }
  }, [activity, router]);

  const onPublish = async () => {
    setIsLoading(true);
    const success = await save(true);
    if (success) {
      router.push('/creer-une-enigme/success');
    }
    setIsLoading(false);
  };

  if (data === null || activity === null || !isEnigme(activity)) {
    return <div></div>;
  }

  const { subCategories } = ENIGME_TYPES[activity.subType ?? 0] ?? ENIGME_TYPES[0];

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[getSubcategoryName(activity.data.theme, data, activity.subType).title, 'Énigme', 'Réponse', 'Prévisualisation']}
          urls={['/creer-une-enigme/1?edit', '/creer-une-enigme/2', '/creer-une-enigme/3', '/creer-une-enigme/4']}
          activeStep={3}
          errorSteps={errorSteps}
        />
        <div className="width-900">
          <h1>Pré-visualisez votre énigme{!isEdit && ', et publiez-la'}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Voici la pré-visualisation de votre énigme.
            {isEdit
              ? " Vous pouvez la modifier à l'étape précédente, et enregistrer vos changements ici."
              : ' Vous pouvez la modifier, et quand vous êtes prêts : publiez-la dans votre village-monde !'}
          </p>
          {isEdit ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
              <Link href="/creer-une-enigme/4" passHref>
                <Button component="a" color="secondary" variant="contained" href="/creer-une-enigme/4">
                  {"Modifier à l'étape précédente"}
                </Button>
              </Link>
              <Button variant="outlined" color="primary" onClick={onPublish}>
                Enregistrer les changements
              </Button>
            </div>
          ) : (
            <>
              {!isValid && (
                <p>
                  <b>Avant de publier votre présentation, il faut corriger les étapes incomplètes, marquées en orange.</b>
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

          <span className={classNames('text text--small text--success', { 'text text--small text--warning': !isValid && errorSteps.includes(0) })}>
            {"Catégorie de l'énigme"}
          </span>
          <div className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(0) })}>
            <EditButton
              onClick={() => {
                router.push(`/creer-une-enigme/1?edit=${activity.id}`);
              }}
              status={errorSteps.includes(0) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            {activity.subType === -1 ? (
              <p style={{ margin: '0.5rem 0' }}>
                <strong>{data.themeName === undefined || data.themeName === '' ? '' : getCategoryName(activity.subType, data).title}</strong>
              </p>
            ) : (
              <p style={{ margin: '0.5rem 0' }}>
                <strong>{(data.theme === -1 ? data.themeName ?? '' : subCategories[data.theme]?.label ?? '').toLowerCase()}</strong>
              </p>
            )}
          </div>

          <span className={classNames('text text--small text--success', { 'text text--small text--warning': !isValid && errorSteps.includes(1) })}>
            Indice présenté aux autres classes
          </span>
          <div className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(1) })}>
            <EditButton
              onClick={() => {
                router.push('/creer-une-enigme/2');
              }}
              status={errorSteps.includes(1) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <ContentView content={activity.content.slice(0, indiceContentIndex)} />
          </div>

          <span className={classNames('text text--small text--success', { 'text text--small text--warning': !isValid && errorSteps.includes(2) })}>
            Réponse
          </span>
          <div className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(2) })}>
            <EditButton
              onClick={() => {
                router.push('/creer-une-enigme/3');
              }}
              status={errorSteps.includes(2) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <ContentView content={activity.content.slice(indiceContentIndex, activity.content.length)} />
          </div>
          <StepsButton prev="/creer-une-enigme/3" />
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default EnigmeStep4;
