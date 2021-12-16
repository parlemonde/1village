import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { isDefi } from 'src/activity-types/anyActivity';
import { isEco, getDefi, ECO_ACTIONS, DEFI } from 'src/activity-types/defi.constants';
import type { EcoDefiData } from 'src/activity-types/defi.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import ActivityLink from 'src/components/activities/Link';
import { Activities } from 'src/components/activities/List';
import { ContentView } from 'src/components/activities/content/ContentView';
import { getErrorSteps } from 'src/components/activities/defiEcologieChecks';
import { REACTIONS } from 'src/components/activities/utils';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { useActivity } from 'src/services/useActivity';
import { ActivityStatus } from 'types/activity.type';

const DefiEcoStep4 = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const { activity: responseActivity } = useActivity(activity?.responseActivityId ?? -1);
  const [isLoading, setIsLoading] = React.useState(false);

  const data = (activity?.data as EcoDefiData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  const errorSteps = React.useMemo(() => {
    const fieldStep2 = activity?.content.filter((d) => d.value !== ''); // if value is empty in step 2
    if (data !== null && fieldStep2?.length === 0) {
      const errors = getErrorSteps(data, 2);
      errors.push(1); //corresponding to step 2
      return errors;
    }
    if (data !== null) return getErrorSteps(data, 2);
    return [];
  }, [activity?.content, data]);
  const isValid = errorSteps.length === 0;

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

  if (data === null || activity === null || !isDefi(activity) || (isDefi(activity) && !isEco(activity))) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Votre geste pour la planète', "Description de l'action", 'Le défi', 'Prévisualisation']}
          urls={['/lancer-un-defi/ecologique/1?edit', '/lancer-un-defi/ecologique/2', '/lancer-un-defi/ecologique/3', '/lancer-un-defi/ecologique/4']}
          activeStep={3}
          errorSteps={errorSteps}
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

          {!isEdit && activity.responseActivityId === null && <ActivityLink url={`/lancer-un-defi/ecologique/1?edit=${activity.id}`} />}
          {responseActivity !== null && (
            <>
              <span className="text text--small text--success">Défi en réaction à {REACTIONS[responseActivity.type]}</span>
              <div className="preview-block">
                {!isEdit && (
                  <EditButton
                    onClick={() => {
                      router.push(`/lancer-un-defi/ecologique/1?edit=${activity.id}`);
                    }}
                    status={'success'}
                    style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
                  />
                )}
                <Activities activities={[responseActivity]} noButtons />
              </div>
            </>
          )}

          <span className={classNames('text text--small text--success', { 'text text--small text--warning': !isValid && errorSteps.includes(0) })}>
            Votre action
          </span>
          <div className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(0) })}>
            <EditButton
              onClick={() => {
                router.push(`/lancer-un-defi/ecologique/1?edit=${activity.id}`);
              }}
              status={errorSteps.includes(0) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            {data.type !== null ? ECO_ACTIONS[data.type % ECO_ACTIONS.length] : ''}
          </div>

          <span className={classNames('text text--small text--success', { 'text text--small text--warning': !isValid && errorSteps.includes(1) })}>
            Description
          </span>
          <div className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(1) })}>
            <EditButton
              onClick={() => {
                router.push('/lancer-un-defi/ecologique/2');
              }}
              status={errorSteps.includes(1) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <ContentView content={activity.content} />
          </div>

          <span className={classNames('text text--small text--success', { 'text text--small text--warning': !isValid && errorSteps.includes(2) })}>
            Le défi lancé aux Pélicopains
          </span>
          <div className={classNames('preview-block', { 'preview-block--warning': !isValid && errorSteps.includes(2) })}>
            <EditButton
              onClick={() => {
                router.push('/lancer-un-defi/ecologique/3');
              }}
              status={errorSteps.includes(2) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            Votre défi : {data.defiIndex !== null ? getDefi(DEFI.ECO, data) : ''}
          </div>

          <StepsButton prev="/lancer-un-defi/ecologique/3" />
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default DefiEcoStep4;
