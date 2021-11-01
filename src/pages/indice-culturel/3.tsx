import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { isIndice } from 'src/activity-types/anyActivity';
import { INDICE_TYPES } from 'src/activity-types/indice.constants';
import type { IndiceData } from 'src/activity-types/indice.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { ActivityCard } from 'src/components/activities/ActivityCard';
import { ContentView } from 'src/components/activities/content/ContentView';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { ActivityStatus } from 'types/activity.type';

const IndiceStep3 = () => {
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const { activity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);

  const data = (activity?.data as IndiceData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  const isValid = React.useMemo(() => {
    if (activity !== null && activity.content.filter((c) => c.value.length > 0 && c.value !== '<p></p>\n').length === 0) {
      return false;
    }
    return true;
  }, [activity]);

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/indice-culturel');
    } else if (activity && !isIndice(activity)) {
      router.push('/indice-culturel');
    }
  }, [activity, router]);

  const onPublish = async () => {
    if (!isValid) {
      return;
    }
    setIsLoading(true);
    const success = await save(true);
    if (success) {
      router.push('/indice-culturel/success');
    }
    setIsLoading(false);
  };

  if (data === null || user === null || activity === null || !('theme' in data) || data.theme === -1) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={[INDICE_TYPES[activity.subType || 0].step1 ?? 'Indice', "Créer l'indice", 'Prévisualiser']}
          activeStep={2}
          errorSteps={isValid ? [] : [1]}
        />
        <div className="width-900">
          <h1>Pré-visualisez votre publication{!isEdit && ' et publiez-la.'}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Voici la pré-visualisation de votre publication.
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
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
              <Link href="/indice-culturel/2" passHref>
                <Button component="a" color="secondary" variant="contained" href="/indice-culture/2">
                  {"Modifier à l'étape précédente"}
                </Button>
              </Link>
              <Button variant="outlined" color="primary" onClick={onPublish}>
                Enregistrer les changements
              </Button>
            </div>
          ) : (
            <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
              <Button variant="outlined" color="primary" onClick={onPublish} disabled={!isValid}>
                Publier
              </Button>
            </div>
          )}

          <span className={'text text--small text--success'}>Thème</span>
          <div className="preview-block">
            <p style={{ margin: '0.5rem 0' }}>{INDICE_TYPES[activity.subType || 0].title}</p>
          </div>

          <span className={`text text--small ${isValid ? 'text--success' : 'text--warning'}`}>Indice culturel</span>
          <div className={classNames('preview-block', { 'preview-block--warning': !isValid })}>
            <EditButton
              onClick={() => {
                router.push('/indice-culturel/2');
              }}
              status={isValid ? 'success' : 'warning'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <ContentView content={activity.content} />
          </div>

          <span className="text text--small">Aperçu de la publication</span>
          <ActivityCard activity={activity} user={user} noMargin noButtons />

          <StepsButton prev="/indice-culturel/2" />
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default IndiceStep3;
