import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { isPresentation } from 'src/activity-types/anyActivity';
import { isThematique, PRESENTATION_THEMATIQUE } from 'src/activity-types/presentation.const';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { Activities } from 'src/components/activities/List';
import { ContentView } from 'src/components/activities/content/ContentView';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { useActivity } from 'src/services/useActivity';
import { ActivityStatus, ActivityType } from 'types/activity.type';

const REACTIONS = {
  [ActivityType.PRESENTATION]: 'cette présentation',
  [ActivityType.DEFI]: 'ce défi',
  [ActivityType.GAME]: 'ce jeu',
  [ActivityType.ENIGME]: 'cette énigme',
  [ActivityType.QUESTION]: 'cette question',
};

const PresentationStep4: React.FC = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const { activity: responseActivity } = useActivity(activity?.responseActivityId ?? -1);
  const [isLoading, setIsLoading] = React.useState(false);

  const data = activity?.data || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/se-presenter');
    } else if (activity && (!isPresentation(activity) || !isThematique(activity))) {
      router.push('/se-presenter');
    }
  }, [activity, router]);

  const onPublish = async () => {
    setIsLoading(true);
    const success = await save(true);
    if (success) {
      router.push('/se-presenter/success');
    }
    setIsLoading(false);
  };

  if (data === null || !('theme' in data) || data.theme === -1) {
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
              <Link href="/se-presenter/thematique/3">
                <Button component="a" color="secondary" variant="contained" href="/se-presenter/thematique/3">
                  {"Modifier à l'étape précédente"}
                </Button>
              </Link>
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

          {!isEdit && activity.responseActivityId === null && (
            <div style={{ margin: '1rem 0' }}>
              Votre présentation initie un nouvel échange avec les Pélicopains,{' '}
              <Link href={`/se-presenter/thematique/1?edit=${activity.id}`}>
                <a className="text text--primary" href={`/se-presenter/thematique/1?edit=${activity.id}`}>
                  si vous souhaitez plutôt réagir à une activité déjà publiée, cliquez ici.
                </a>
              </Link>
            </div>
          )}
          {responseActivity !== null && (
            <>
              <span className="text text--small text--success">Présentation en réaction à {REACTIONS[responseActivity.type]}</span>
              <div className="preview-block">
                {!isEdit && (
                  <EditButton
                    onClick={() => {
                      router.push(`/se-presenter/thematique/1?edit=${activity.id}`);
                    }}
                    isGreen
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
                  />
                )}
                <Activities activities={[responseActivity]} noButtons />
              </div>
            </>
          )}

          <span className="text text--small text--success">Thème</span>
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/se-presenter/thematique/2');
              }}
              isGreen
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
              isGreen
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <ContentView content={activity.processedContent} />
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
