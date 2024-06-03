import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { AudioPlayer } from 'src/components/audio/AudioPlayer';
import { EditButton } from 'src/components/buttons/EditButton';
import { ActivityContext } from 'src/contexts/activityContext';
import { ActivityStatus } from 'types/activity.type';
import type { ClassAnthemData } from 'types/classAnthem.types';

const SongStep5 = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const [isLoading, setIsLoading] = React.useState(false);
  const data = (activity?.data as ClassAnthemData) || null;
  const isEdit = activity !== null && activity.id !== 0 && activity.status !== ActivityStatus.DRAFT;
  const errorSteps = React.useMemo(() => {
    const errors: number[] = [];
    if (data !== null && !data?.verseMixUrl) {
      errors.push(0);
    }
    if (data !== null && !data.classRecordTrack.sampleUrl) {
      errors.push(3);
    }

    return errors;
  }, [data]);

  const onPublish = async () => {
    setIsLoading(true);
    const { success } = await save(true);
    if (success) {
      router.push('/chanter-un-couplet/success');
    }
    setIsLoading(false);
  };

  if (data === null || activity === null) {
    return <div></div>;
  }

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Mixer', 'Écrire', 'Enregistrer', 'Synchroniser', 'Prévisualiser']}
          activeStep={4}
          errorSteps={errorSteps}
          urls={['/chanter-un-couplet/1?edit', '/chanter-un-couplet/2', '/chanter-un-couplet/3', '/chanter-un-couplet/4', '/chanter-un-couplet/5']}
        />
        <div className="width-900">
          <h1>Pré-visualisez votre paramétrage et activez l&apos;hymne</h1>
          <p className="text" style={{ fontSize: '1.1rem' }}>
            Voici la pré-visualisation de votre couplet.
            {isEdit
              ? " Vous pouvez la modifier à l'étape précédente, et enregistrer vos changements ici."
              : ' Vous pouvez la modifier, et quand vous êtes prêts : publiez-la dans votre village-monde !'}
          </p>
          {isEdit ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
              <Link href="/chanter-un-couplet/4" passHref>
                <Button component="a" color="secondary" variant="contained" href="/chanter-un-couplet/4">
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
                Publier
              </Button>
            </div>
          )}

          <div className={classNames('preview-block', { 'preview-block--warning': errorSteps.includes(0) })}>
            <EditButton
              onClick={() => {
                router.push('/chanter-un-couplet/1');
              }}
              status={errorSteps.includes(0) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />

            <p style={{ margin: '0.5rem 0' }}>Écoutez le mix de votre couplet</p>
            <AudioPlayer src={data.verseMixUrl} isBuildingAudio style={{ width: '350px', height: '60px' }} />
          </div>

          <div className={classNames('preview-block', { 'preview-block--warning': errorSteps.includes(1) })}>
            <EditButton
              onClick={() => {
                router.push('/chanter-un-couplet/3');
              }}
              status={errorSteps.includes(1) ? 'warning' : 'success'}
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
                router.push('/chanter-un-couplet/4');
              }}
              status={errorSteps.includes(3) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />
            <p style={{ margin: '0.5rem 0' }}>Écoutez votre couplet (seulement votre voix)</p>
            <AudioPlayer src={data.classRecordTrack?.sampleUrl} isBuildingAudio style={{ width: '350px', height: '60px' }} />
          </div>

          <div className={classNames('preview-block', { 'preview-block--warning': errorSteps.includes(3) })}>
            <EditButton
              onClick={() => {
                router.push('/chanter-un-couplet/4');
              }}
              status={errorSteps.includes(3) ? 'warning' : 'success'}
              style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}
            />

            <p style={{ margin: '0.5rem 0' }}>Écoutez votre couplet superposé à la mélodie</p>
            <AudioPlayer src={data.verseFinalMixUrl} isBuildingAudio style={{ width: '350px', height: '60px' }} />
          </div>

          <StepsButton prev="/chanter-un-couplet/4" />
        </div>
      </div>
      <Backdrop style={{ zIndex: 2000, color: 'white' }} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Base>
  );
};

export default SongStep5;
