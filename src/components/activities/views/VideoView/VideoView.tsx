import classnames from 'classnames';
import ReactPlayer from 'react-player';
import React from 'react';

import { KeepRatio } from 'src/components/KeepRatio';

import type { ViewProps } from '../../editing.types';

const VideoView: React.FC<ViewProps> = ({ value, isPreview }: ViewProps) => {
  return (
    <div
      className={classnames('text-center', {
        'text-preview': isPreview,
        'activity-data': !isPreview,
      })}
    >
      {isPreview ? (
        <div
          style={{
            display: 'inline-block',
            width: '24rem',
            height: '13.5rem',
            backgroundColor: 'black',
          }}
        >
          <ReactPlayer width="100%" height="100%" light url={value} controls />
        </div>
      ) : (
        <KeepRatio ratio={9 / 16} maxWidth="600px">
          <ReactPlayer width="100%" height="100%" url={value} controls style={{ backgroundColor: 'black' }} />
        </KeepRatio>
      )}
    </div>
  );
};

export default VideoView;
