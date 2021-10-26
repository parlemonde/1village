import React from 'react';

import type { FreeContentActivity } from 'src/activity-types/freeContent.types';

import { H5pView } from '../content/views/H5pView';
import { ImageView } from '../content/views/ImageView';
import { SoundView } from '../content/views/SoundView';
import { TextView } from '../content/views/TextView';
import { VideoView } from '../content/views/VideoView';

import type { ActivityViewProps } from './activity-view.types';

const resultObj = (p) => ({
  text: <TextView id={p.id} value={p.value} key={p.id} />,
  image: <ImageView id={p.id} value={p.value} key={p.id} />,
  video: <VideoView id={p.id} value={p.value} key={p.id} />,
  sound: <SoundView id={p.id} value={p.value} key={p.id} />,
  h5p: <H5pView id={p.id} value={p.value} key={p.id} />,
})

export const FreeContentView = ({ activity }: ActivityViewProps<FreeContentActivity>) => {
  return (
    <div>
      <h3>{activity.data.title}</h3>
      <div>
        {activity.processedContent.map((p) => (resultObj(p)[p.type] ? resultObj(p)[p.type] : null))}
      </div>
    </div>
  );
};
