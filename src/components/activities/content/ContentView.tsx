import React from 'react';

import { H5pView } from './views/H5pView';
import { ImageView } from './views/ImageView';
import { SoundView } from './views/SoundView';
import { TextView } from './views/TextView';
import { VideoView } from './views/VideoView';
import type { ActivityContent } from 'types/activity.type';

type ContentViewProps = { content: ActivityContent[]; activityId?: number };

export const ContentView = ({ content, activityId }: ContentViewProps) => {
  return (
    <div>
      {content.map((p) => {
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
          return <H5pView id={p.id} value={p.value} activityId={activityId} key={p.id} />;
        }
        return null;
      })}
    </div>
  );
};
