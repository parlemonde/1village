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
import type { Syllable } from 'types/anthem.type';

const SongStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const data = (activity?.data as ClassAnthemData) || null;
  const errorSteps = React.useMemo(() => {
    const errors: number[] = [];
    if (data !== null && !data.verseMixUrl) {
      errors.push(0);
    }

    return errors;
  }, [data]);

  const updateVerse = (verseLyrics: Syllable[]) => {
    updateActivity({ data: { ...data, verseLyrics } });
  };

  const onNext = () => {
    save().catch(console.error);
    router.push('/chanter-un-couplet/3');
  };

  return (
    <Base>
      <div className={styles.mainContainer}>
        <Steps
          steps={['Mixer', 'Écrire', 'Enregistrer', 'Synchroniser', 'Prévisualiser']}
          activeStep={1}
          errorSteps={errorSteps}
          urls={['/chanter-un-couplet/1', '/chanter-un-couplet/2', '/chanter-un-couplet/3', '/chanter-un-couplet/4', '/chanter-un-couplet/5']}
        />
        <div className={styles.contentContainer}>
          <h1>À vous d&apos;écrire le couplet !</h1>
          <p>
            Pour vous aider, je vous propose de remplir cette grille, puis de remplacer chaque &quot;La&quot; par une syllabe de votre couplet.
            N&apos;hésitez pas à ré-écouter le couplet.
          </p>
          <AudioPlayer src={data.verseMixUrl} isBuildingAudio />
          <div className={styles.contentContainer}>
            <div className={styles.anthemLyricsContainer}>
              {data?.verseLyrics.map((el, index) => (
                <SyllableEditor
                  key={`syllableEditor--verseLyrics--${index}`}
                  value={el}
                  onChange={(newValue) => {
                    const newVerseLyrics = [...data.verseLyrics];
                    newVerseLyrics[index] = newValue;
                    updateVerse(newVerseLyrics);
                  }}
                />
              ))}
            </div>
            <StepsButton prev="/chanter-un-couplet/1" next={onNext} />
          </div>
        </div>
      </div>
    </Base>
  );
};

export default SongStep2;
