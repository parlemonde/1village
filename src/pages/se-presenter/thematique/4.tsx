import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { Tooltip } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { isPresentation } from 'src/activity-types/anyActivity';
import { PRESENTATION_THEMATIQUE } from 'src/activity-types/presentation.constants';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { ContentView } from 'src/components/activities/content/ContentView';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { ActivityStatus } from 'types/activity.type';
import { UserType } from 'types/user.type';

const PresentationStep4 = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const { user } = React.useContext(UserContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const isObservator = user?.type === UserType.OBSERVATOR;

  const data = activity?.data || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/se-presenter');
    } else if (activity && !isPresentation(activity)) {
      router.push('/se-presenter');
    }
  }, [activity, router]);

  const onPublish = async () => {
    setIsLoading(true);
    const { success } = await save(true);
    if (success) {
      router.push('/se-presenter/success');
    }
    setIsLoading(false);
  };

  if (activity === null || data === null || !('theme' in data) || data.theme === -1) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={(isEdit ? [] : ['Démarrer']).concat(['Choix du thème', 'Présentation', 'Prévisualisation'])} activeStep={isEdit ? 2 : 3} />
        <div className="width-900">
          <h1>Pré-visualisez votre présentation{!isEdit && ' et publiez-la'}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Voici la pré-visualisation de votre présentation.
            {isEdit
              ? " Vous pouvez la modifier à l'étape précédente, et enregistrer vos changements ici."
              : ' Vous pouvez la modifier, et quand vous êtes prêts : publiez-la dans votre village-monde !'}
          </p>
          {isEdit ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
              <Link href="/se-presenter/thematique/3" passHref>
                <Button component="a" color="secondary" variant="contained" href="/se-presenter/thematique/3">
                  {"Modifier à l'étape précédente"}
                </Button>
              </Link>
              <Button variant="outlined" color="primary" onClick={onPublish} disabled={isObservator}>
                Enregistrer les changements
              </Button>
            </div>
          ) : (
            <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
              {isObservator ? (
                <Tooltip title="Action non autorisée" arrow>
                  <span>
                    <Button variant="outlined" color="primary" disabled>
                      Publier
                    </Button>
                  </span>
                </Tooltip>
              ) : (
                <Button variant="outlined" color="primary" onClick={onPublish}>
                  Publier
                </Button>
              )}
            </div>
          )}

          <span className="text text--small text--success">Thème</span>
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/se-presenter/thematique/2');
              }}
              status={'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <p style={{ margin: '0.5rem 0' }}>{PRESENTATION_THEMATIQUE[(data?.theme as number | null) ?? 0]?.cardTitle}</p>
          </div>

          <span className="text text--small text--success">Présentation</span>
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/se-presenter/thematique/3');
              }}
              status={'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <ContentView content={activity.content} />
          </div>

          <StepsButton prev="/se-presenter/thematique/3" />
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default PresentationStep4;
