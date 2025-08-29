import { useRouter } from 'next/router';
import React from 'react';

import styles from '../../styles/chanter-un-couplet.module.css';
import { Base } from 'src/components/Base';
import { PageLayout } from 'src/components/PageLayout';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { SyllableEditor } from 'src/components/activities/content/editors/SyllableEditor';
import { AudioPlayer } from 'src/components/audio/AudioPlayer';
import { ActivityContext } from 'src/contexts/activityContext';
import { toTime } from 'src/utils/toTime';
import { TrackType } from 'types/anthem.type';
import type { ClassAnthemData } from 'types/classAnthem.types';

const SongStep3 = () => {
  const router = useRouter();
  const { activity, save } = React.useContext(ActivityContext);
  const data = (activity?.data as ClassAnthemData) || null;

  const errorSteps = React.useMemo(() => {
    const errors: number[] = [];
    if (data !== null && !data.verseMixUrl) {
      errors.push(0);
    }
    return errors;
  }, [data]);

  const onNext = () => {
    save().catch(console.error);
    router.push('/chanter-un-couplet/4');
  };
  if (!data) {
    return <Base></Base>;
  }
  const introChorus = data?.anthemTracks?.find((track) => track.type === TrackType.INTRO_CHORUS);
  return (
    <Base>
      <PageLayout>
        <Steps
          steps={['Mixer', 'Écrire', 'Enregistrer', 'Synchroniser', 'Prévisualiser']}
          activeStep={2}
          errorSteps={errorSteps}
          urls={['/chanter-un-couplet/1?edit', '/chanter-un-couplet/2', '/chanter-un-couplet/3', '/chanter-un-couplet/4', '/chanter-un-couplet/5']}
        />
        <div className={styles.contentContainer}>
          <h1>Enregistrez vos voix</h1>
          <p>Entraînez-vous à chanter votre couplet avec l’audio et les paroles ci-dessous puis enregistrez-vous avec un téléphone ou un micro.</p>

          {data.verseMixUrl ? (
            <AudioPlayer src={data.verseMixWithIntroUrl} isBuildingAudio />
          ) : (
            <p>
              <b>Il manque votre mix du couplet !</b>
            </p>
          )}
          <h2>Le refrain</h2>
          <div className={styles.anthemLyricsContainer}>
            {data.chorusLyrics.map((el, index) => (
              <SyllableEditor key={`syllableEditor--chorus--${index}`} value={el} />
            ))}
          </div>
          <h2>Votre couplet {introChorus && <>(démarre à {toTime(introChorus.sampleDuration)})</>}</h2>
          <div className={styles.anthemLyricsContainer}>
            {data.verseLyrics.map((el, index) => (
              <SyllableEditor key={`syllableEditor--verseLyrics--${index}`} value={el} />
            ))}
          </div>
          <StepsButton prev="/chanter-un-couplet/2" next={onNext} />
        </div>
      </PageLayout>
    </Base>
  );
};

export default SongStep3;
