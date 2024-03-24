import { useRouter } from 'next/router';
import React from 'react';

import styles from './chanter-un-couplet.module.css';
import type { ClassAnthemData } from 'src/activity-types/classAnthem.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { SyllableEditor } from 'src/components/activities/content/editors/SyllableEditor';
import { AudioPlayer } from 'src/components/audio/AudioPlayer';
import { ActivityContext } from 'src/contexts/activityContext';
import { toTime } from 'src/utils/toTime';
import { TrackType } from 'types/anthem.type';

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
  return (
    <Base>
      <div className={styles.mainContainer}>
        <Steps
          steps={['Mixer', 'Écrire', 'Enregistrer', 'Synchroniser', 'Prévisualiser']}
          activeStep={2}
          errorSteps={errorSteps}
          urls={['/chanter-un-couplet/1', '/chanter-un-couplet/2', '/chanter-un-couplet/3', '/chanter-un-couplet/4', '/chanter-un-couplet/5']}
        />
        <div className={styles.contentContainer}>
          <h1>Enregistrez votre voix</h1>
          <p>
            À présent, il est temps d’enregistrer votre classe entrain de chanter votre couplet ! Pour vous aider, vous pouvez écouter l’hymne, avec
            l’introduction, le refrain accompagné des paroles, et le couplet accompagné seulement de la mélodie.
          </p>
          <p>
            Essayez de diffuser la musique d’un côté de la salle de classe, et de placer votre micro de l’autre côté, afin d’enregistrer surtout vos
            voix.
          </p>
          <p>Vous pouvez également chanter a cappella, ou en enregistrant un élève portant un casque.</p>

          {data.verseMixUrl ? (
            <AudioPlayer src={data.verseMixUrl} isBuildingAudio />
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
          <h2>Votre couplet (démarre à {toTime(data.verseTracks[TrackType.INTRO_CHORUS].sampleDuration)})</h2>
          <div className={styles.anthemLyricsContainer}>
            {data.verseLyrics.map((el, index) => (
              <SyllableEditor key={`syllableEditor--verseLyrics--${index}`} value={el} />
            ))}
          </div>
          <StepsButton prev="/chanter-un-couplet/2" next={onNext} />
        </div>
      </div>
    </Base>
  );
};

export default SongStep3;
