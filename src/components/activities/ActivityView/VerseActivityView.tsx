import React from 'react';

import { SyllableEditor } from 'src/components/activities/content/editors/SyllableEditor';
import { bgPage } from 'src/styles/variables.const';

import type { ClassAnthemActivity } from 'types/classAnthem.types';

import type { ActivityViewProps } from './activity-view.types';

export const VerseActivityView = ({ activity }: ActivityViewProps<ClassAnthemActivity>) => {
  return (
    <div>
      <div style={{ margin: '2rem 0', backgroundColor: bgPage, padding: '0.5rem', borderRadius: '5px' }}>Voilà les paroles de notre couplet :</div>
      {activity.data.verseLyrics.map((el, index) => (
        <SyllableEditor key={`syllableEditor--verseLyrics--${index}`} value={el} />
      ))}
      <div>
        <audio controls src={activity.data.verseFinalMixUrl} />
      </div>
    </div>
  );
};
