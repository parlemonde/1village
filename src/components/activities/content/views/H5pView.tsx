import React from 'react';

import type { ViewProps } from '../content.types';
import { H5p } from 'src/components/H5pOLD';
import { H5pPlayer } from 'src/components/h5p';

export const H5pView = ({ activityId, value }: ViewProps) => {
  const contentId = value?.match(/^\/h5p\/data\/([\w|-]+)\/play$/)?.[1] ?? null;

  return (
    <div className="text-center activity-data">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {contentId ? <H5pPlayer contentId={contentId} contextId={`${activityId}`} /> : value && <H5p src={value} />}
      </div>
    </div>
  );
};
