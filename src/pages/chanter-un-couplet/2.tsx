import { useRouter } from 'next/router';
import React from 'react';

import type { Syllable } from 'src/activity-types/anthem.types';
import type { VerseRecordData } from 'src/activity-types/verseRecord.types';
import { Base } from 'src/components/Base';
import { Steps } from 'src/components/Steps';
import { StepsButton } from 'src/components/StepsButtons';
import { SyllableEditor } from 'src/components/activities/content/editors/SyllableEditor';
import { ActivityContext } from 'src/contexts/activityContext';

const SongStep2 = () => {
  const router = useRouter();
  const { activity, updateActivity, save } = React.useContext(ActivityContext);
  const data = (activity?.data as VerseRecordData) || null;
  const errorSteps = React.useMemo(() => {
    const errors: number[] = [];
    if (data !== null && !data.customizedMix) {
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
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps
          steps={['Mixer', 'Écrire', 'Enregistrer', 'Synchroniser', 'Prévisualiser']}
          activeStep={1}
          errorSteps={errorSteps}
          urls={['/chanter-un-couplet/1', '/chanter-un-couplet/2', '/chanter-un-couplet/3', '/chanter-un-couplet/4', '/chanter-un-couplet/5']}
        />
        <h1>À vous d&apos;écrire le couplet !</h1>
        <p>
          Pour vous aider, je vous propose de remplir cette grille, puis de remplacer chaque &quot;La&quot; par une syllabe de votre couplet.
          N&apos;hésitez pas à ré-écouter le couplet.
        </p>
        {data?.verseMixUrl ? (
          <audio controls src={data?.verseMixUrl} />
        ) : (
          <p>
            <b>Il manque votre mix du couplet !</b>
          </p>
        )}
        <div className="width-900">
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
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
    </Base>
  );
};

export default SongStep2;
