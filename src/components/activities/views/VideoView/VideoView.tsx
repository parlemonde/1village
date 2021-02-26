import classnames from 'classnames';
import ReactPlayer from 'react-player';
import React from 'react';

import { KeepRatio } from 'src/components/KeepRatio';

import type { ViewProps } from '../../editing.types';

const VideoView: React.FC<ViewProps> = ({ value }: ViewProps) => {
  return (
    <div className="text-center activity-data">
      <KeepRatio ratio={9 / 16} maxWidth="600px">
        <ReactPlayer width="100%" height="100%" url={value} controls style={{ backgroundColor: 'black' }} />
      </KeepRatio>
    </div>
  );
};

export default VideoView;
