import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import type { AnthemData } from 'src/activity-types/anthem.types';
import { isAnthem } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { getErrorSteps } from 'src/components/activities/anthemChecks';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { VillageContext } from 'src/contexts/villageContext';
import { useVillageRequests } from 'src/services/useVillages';
import { ActivityStatus } from 'types/activity.type';

const AnthemStep5 = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const { village } = React.useContext(VillageContext);
  const { editVillage } = useVillageRequests();
  const [isLoading, setIsLoading] = React.useState(false);
  const data = (activity?.data as AnthemData) || null;

  const errorSteps = React.useMemo(() => {
    if (data !== null) {
      return getErrorSteps(data, 1);
    }
    return [];
  }, [data]);

  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;

  React.useEffect(() => {
    if (activity === null && !('activity-id' in router.query) && !sessionStorage.getItem('activity')) {
      router.push('/parametrer-hymne');
    } else if (activity && !isAnthem(activity)) {
      router.push('/parametrer-hymne');
    }
  }, [activity, router, village]);

  const onPublish = async () => {
    setIsLoading(true);
    const response = await save(true);
    if (response.success) {
      if (village !== null) {
        await editVillage({ id: village.id, anthemId: response.activity.id });
      }
      window.location.assign('/parametrer-hymne/success'); // use window location assign to refresh the page and get an updated village.
    }
    setIsLoading(false);
  };

  if (data === null || activity === null || !isAnthem(activity)) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Mix Couplet', 'Intro Outro', 'Couplet', 'Refrain', 'Prévisualiser']}
          errorSteps={errorSteps}
          activeStep={4}
          urls={['/parametrer-hymne/1', '/parametrer-hymne/2', '/parametrer-hymne/3', '/parametrer-hymne/4', '/parametrer-hymne/5']}
        />
        <div className="width-900">
          <h1>Pré-visualisez votre paramétrage et activez l&apos;hymne</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Voici la pré-visualisation de votre paramétrage.
            {isEdit
              ? " Vous pouvez la modifier à l'étape précédente, et enregistrer vos changements ici."
              : ' Vous pouvez la modifier, et quand vous êtes prêts : activez ce paramétrage dans ce village-monde !'}
          </p>
          {isEdit ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
              <Link href="/parametrer-hymne/4" passHref>
                <Button component="a" color="secondary" variant="contained" href="/parametrer-hymne/4">
                  {"Modifier à l'étape précédente"}
                </Button>
              </Link>
              <Button variant="outlined" color="primary" onClick={onPublish}>
                Enregistrer les changements
              </Button>
            </div>
          ) : (
            <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
              <Button variant="outlined" color="primary" onClick={onPublish} disabled={errorSteps.length !== 0}>
                Paramétrer
              </Button>
            </div>
          )}

          <div className={classNames('preview-block', { 'preview-block--warning': errorSteps.includes(0) })}>
            <EditButton
              onClick={() => {
                router.push('/parametrer-hymne/1');
              }}
              status={errorSteps.includes(0) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />

            {/* TODO preview of the verses final mix */}
            <p style={{ margin: '0.5rem 0' }}>Écoutez le mix par défaut du couplet (les 7 pistes mélangées)</p>
          </div>

          <div className={classNames('preview-block', { 'preview-block--warning': errorSteps.includes(1) })}>
            <EditButton
              onClick={() => {
                router.push('/parametrer-hymne/2');
              }}
              status={errorSteps.includes(1) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            {/* TODO preview of the final mix */}
            <p style={{ margin: '0.5rem 0' }}>Écoutez le mix de l&apos;hymne (intro + refrain + couplet mixé + outro)</p>
          </div>

          <div className={classNames('preview-block', { 'preview-block--warning': errorSteps.includes(2) })}>
            <EditButton
              onClick={() => {
                router.push('/parametrer-hymne/3');
              }}
              status={errorSteps.includes(2) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <p>Voilà la structure du couplet, découpé en syllabes :</p>
            <p>
              {data.verseLyrics.map((syllable, index) =>
                syllable.back ? (
                  <React.Fragment key={index}>
                    <br /> {syllable.value}{' '}
                  </React.Fragment>
                ) : (
                  <React.Fragment key={index}>{syllable.value} </React.Fragment>
                ),
              )}
            </p>
          </div>

          <div className={classNames('preview-block', { 'preview-block--warning': errorSteps.includes(3) })}>
            <EditButton
              onClick={() => {
                router.push('/parametrer-hymne/4');
              }}
              status={errorSteps.includes(3) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <p>Voilà le refrain découpé en syllabes :</p>
            <p>
              {data.chorusLyrics.map((syllable, index) =>
                syllable.back ? (
                  <React.Fragment key={index}>
                    <br /> {syllable.value}{' '}
                  </React.Fragment>
                ) : (
                  <React.Fragment key={index}>{syllable.value} </React.Fragment>
                ),
              )}
            </p>
          </div>

          <StepsButton prev="/parametrer-hymne/4" />
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default AnthemStep5;
