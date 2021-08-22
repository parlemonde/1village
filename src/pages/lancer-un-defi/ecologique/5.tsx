import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { isDefi } from 'src/activity-types/anyActivity';
import { isEco, getDefi, ECO_ACTIONS, DEFI } from 'src/activity-types/defi.const';
import { EcoDefiData } from 'src/activity-types/defi.types';
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

const DefiEcoStep5 = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const { activity: responseActivity } = useActivity(activity?.responseActivityId ?? -1);
  const [isLoading, setIsLoading] = React.useState(false);

  const data = (activity?.data as EcoDefiData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/lancer-un-defi');
    } else if (activity && (!isDefi(activity) || (isDefi(activity) && !isEco(activity)))) {
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

  if (data === null || !isDefi(activity) || (isDefi(activity) && !isEco(activity))) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={(isEdit ? [] : ['Démarrer']).concat(['Votre geste pour la planète', "Description de l'action", 'Le défi', 'Prévisualisation'])}
          activeStep={isEdit ? 3 : 4}
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
              <Link href="/lancer-un-defi/ecologique/4" passHref>
                <Button component="a" color="secondary" variant="contained" href="/lancer-un-defi/ecologique/4">
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
              Votre défi initie un nouvel échange avec les Pélicopains,{' '}
              <Link href={`/lancer-un-defi/ecologique/1?edit=${activity.id}`}>
                <a className="text text--primary" href={`/lancer-un-defi/ecologique/1?edit=${activity.id}`}>
                  si vous souhaitez plutôt réagir à une activité déjà publiée, cliquez ici.
                </a>
              </Link>
            </div>
          )}
          {responseActivity !== null && (
            <>
              <span className="text text--small text--success">Défi en réaction à {REACTIONS[responseActivity.type]}</span>
              <div className="preview-block">
                {!isEdit && (
                  <EditButton
                    onClick={() => {
                      router.push(`/lancer-un-defi/ecologique/1?edit=${activity.id}`);
                    }}
                    isGreen
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
                  />
                )}
                <Activities activities={[responseActivity]} noButtons />
              </div>
            </>
          )}

          <span className="text text--small text--success">Votre action</span>
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/lancer-un-defi/ecologique/2');
              }}
              isGreen
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            {ECO_ACTIONS[data.type % ECO_ACTIONS.length]}
          </div>

          <span className="text text--small text--success">Description</span>
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/lancer-un-defi/ecologique/3');
              }}
              isGreen
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <ContentView content={activity.processedContent} />
          </div>

          <span className="text text--small text--success">Le défi lancé aux Pélicopains</span>
          <div className="preview-block">
            <EditButton
              onClick={() => {
                router.push('/lancer-un-defi/ecologique/4');
              }}
              isGreen
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            Votre défi : {getDefi(DEFI.ECO, data)}
          </div>

          <StepsButton prev="/lancer-un-defi/ecologique/4" />
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default DefiEcoStep5;
