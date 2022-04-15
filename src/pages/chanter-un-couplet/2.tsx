import React from 'react';

import type { Syllable } from 'src/activity-types/anthem.types';
import type { VerseRecordData } from 'src/activity-types/verseRecord.types';
import { Base } from 'src/components/Base';
import { StepsButton } from 'src/components/StepsButtons';
import { Steps } from 'src/components/Steps';
import { SyllableEditor } from 'src/components/activities/content/editors/SyllableEditor';
import { ActivityContext } from 'src/contexts/activityContext';

const SongStep2 = () => {
  const { activity, updateActivity } = React.useContext(ActivityContext);
  const data = (activity?.data as VerseRecordData) || null;
  const errorSteps = React.useMemo(() => {
    const errors: number[] = [];
    if (activity !== null && !data.customizedMix) {
      errors.push(0);
    }

    return errors;
  }, [activity]);

  const updateVerse = (verseLyrics: Syllable[]) => {
    updateActivity({ data: { ...data, verseLyrics } });
  };

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <Steps steps={['Mixer', 'Écrire', 'Enregistrer', 'Synchroniser', 'Prévisualiser']} activeStep={1} errorSteps={errorSteps} />
        <h1>À vous d&apos;écrire le couplet !</h1>
        <p>
          Pour vous aider, je vous propose de remplir cette grille, puis de remplacer chaque &quot;La&quot; par une syllabe de votre couplet.
          N&apos;hésitez pas à ré-écouter le couplet.
        </p>
        {data?.customizedMix ? (
          <audio controls src={data?.customizedMix} />
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
                backline={el.back}
                index={index}
                update={updateVerse}
                data={data.verseLyrics}
                editable
                song
              />
            ))}
          </div>
          <StepsButton prev="/chanter-un-couplet/1" next="/chanter-un-couplet/3" />
        </div>
      </div>
    </Base>
  );
};

export default SongStep2;
