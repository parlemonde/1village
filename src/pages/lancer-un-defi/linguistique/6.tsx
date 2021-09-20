import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { isDefi } from 'src/activity-types/anyActivity';
import { isLanguage, getDefi, getLanguageObject, DEFI } from 'src/activity-types/defi.constants';
import type { LanguageDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { Activities } from 'src/components/activities/List';
import ActivityLink from 'src/components/activities/Link';
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
  [ActivityType.INDICE]: 'cet indice culturel',
};

const DefiStep6 = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const { activity: responseActivity } = useActivity(activity?.responseActivityId ?? -1);
  const [isLoading, setIsLoading] = React.useState(false);

  const data = (activity?.data as LanguageDefiData) || null;
  const explanationContentIndex = Math.max(data?.explanationContentIndex ?? 0, 0);
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/lancer-un-defi');
    } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isLanguage(activity)))) {
      router.push('/lancer-un-defi');
    }
  }, [activity, router]);

  const onPublish = async () => {
    setIsLoading(true);
    const success = await save(true);
    if (success) {
      router.push('/lancer-un-defi/success');
    }
    setIsLoading(false);
  };

  if (data === null || !isDefi(activity) || (isDefi(activity) && !isLanguage(activity))) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={(isEdit ? [] : ['Démarrer']).concat(['Choix de la langue', "Choix de l'objet", 'Explication', 'Le défi', 'Prévisualisation'])}
          activeStep={isEdit ? 4 : 5}
        />
        <div className="width-900">
          <h1>Pré-visualisez votre défi{!isEdit && ', et publiez-la'}</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Voici la pré-visualisation de votre défi.
            {isEdit
              ? " Vous pouvez le modifier à l'étape précédente, et enregistrer vos changements ici."
              : ' Vous pouvez le modifier, et quand vous êtes prêts : publiez-le dans votre village-monde !'}
          </p>
          {isEdit ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
              <Link href="/lancer-un-defi/linguistique/5" passHref>
                <Button component="a" color="secondary" variant="contained" href="/lancer-un-defi/linguistique/5">
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

          {!isEdit && activity.responseActivityId === null && <ActivityLink url={`/lancer-un-defi/linguistique/1?edit=${activity.id}`} />}

          {responseActivity !== null && (
            <>
              <span className="text text--small text--success">Défi en réaction à {REACTIONS[responseActivity.type]}</span>
              <div className="preview-block">
                {!isEdit && (
                  <EditButton
                    onClick={() => {
                      router.push(`/lancer-un-defi/linguistique/1?edit=${activity.id}`);
                    }}
                    status={'success'}
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
                  />
                )}
                <Activities activities={[responseActivity]} noButtons />
              </div>
            </>
          )}

          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/lancer-un-defi/linguistique/2');
              }}
              status={'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            {getLanguageObject(data)}
          </div>

          <span className="text text--small text--success">{"L'expression"}</span>
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/lancer-un-defi/linguistique/3');
              }}
              status={'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <ContentView content={activity.processedContent.slice(0, explanationContentIndex)} />
          </div>

          <span className="text text--small text--success">Explication</span>
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/lancer-un-defi/linguistique/4');
              }}
              status={'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <ContentView content={activity.processedContent.slice(explanationContentIndex, activity.processedContent.length)} />
          </div>

          <span className="text text--small text--success">Le défi lancé aux Pélicopains</span>
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/lancer-un-defi/linguistique/5');
              }}
              status={'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            Votre défi : {getDefi(DEFI.LANGUAGE, data)}
          </div>

          <StepsButton prev="/lancer-un-defi/linguistique/5" />
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default DefiStep6;
