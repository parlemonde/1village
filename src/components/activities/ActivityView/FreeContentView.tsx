import React from 'react';

import type { FreeContentActivity } from 'src/activity-types/freeContent.types';

import { H5pView } from '../content/views/H5pView';
import { ImageView } from '../content/views/ImageView';
import { SoundView } from '../content/views/SoundView';
import { TextView } from '../content/views/TextView';
import { VideoView } from '../content/views/VideoView';

import type { ActivityViewProps } from './activity-view.types';

export const FreeContentView = ({ activity }: ActivityViewProps<FreeContentActivity>) => {
  return (
    <div>
      <h3>{activity.data.title}</h3>
      <div>
        {activity.processedContent.map((p) => {
          if (p.type === 'text') {
            return <TextView id={p.id} value={p.value} key={p.id} />;
          }
          if (p.type === 'image') {
            return <ImageView id={p.id} value={p.value} key={p.id} />;
          }
          if (p.type === 'video') {
            return <VideoView id={p.id} value={p.value} key={p.id} />;
          }
          if (p.type === 'sound') {
            return <SoundView id={p.id} value={p.value} key={p.id} />;
          }
          if (p.type === 'h5p') {
            return <H5pView id={p.id} value={p.value} key={p.id} />;
          }
          return null;
        })}
      </div>
    </div>
  );
};
