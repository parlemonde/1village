import React from 'react';

import { EditorContent } from 'src/activities/extendedActivity.types';

import { ActivityViewProps } from './editing.types';
import { H5pView } from './views/H5pView';
import { ImageView } from './views/ImageView';
import { TextView } from './views/TextView';
import { VideoView } from './views/VideoView';

type SimpleActivityViewProps = ActivityViewProps & { content?: EditorContent[] };

export const SimpleActivityView: React.FC<SimpleActivityViewProps> = ({ activity, content }: SimpleActivityViewProps) => {
  return (
    <div>
      {(content ?? activity.processedContent).map((p) => {
        if (p.type === 'text') {
          return <TextView id={p.id} value={p.value} key={p.id} />;
        }
        if (p.type === 'image') {
          return <ImageView id={p.id} value={p.value} key={p.id} />;
        }
        if (p.type === 'video') {
          return <VideoView id={p.id} value={p.value} key={p.id} />;
        }
        if (p.type === 'h5p') {
          return <H5pView id={p.id} value={p.value} key={p.id} />;
        }
        return null;
      })}
    </div>
  );
};
