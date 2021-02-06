import React from 'react';

import { ActivityContext } from 'src/contexts/activityContext';

import { H5pPreview } from './previews/H5pPreview';
import { ImagePreview } from './previews/ImagePreview';
import { TextPreview } from './previews/TextPreview';
import { VideoPreview } from './previews/VideoPreview';

export const SimpleActivityPreview: React.FC = () => {
  const { activity } = React.useContext(ActivityContext);

  return (
    <div>
      {activity.processedContent.map((p) => {
        if (p.type === 'text') {
          return <TextPreview id={p.id} value={p.value} key={p.id} />;
        }
        if (p.type === 'image') {
          return <ImagePreview id={p.id} value={p.value} key={p.id} />;
        }
        if (p.type === 'video') {
          return <VideoPreview id={p.id} value={p.value} key={p.id} />;
        }
        if (p.type === 'h5p') {
          return <H5pPreview id={p.id} value={p.value} key={p.id} />;
        }
        return null;
      })}
    </div>
  );
};
