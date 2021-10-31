import React from 'react';

import type { ViewProps } from '../content.types';

export const TextView = ({ value }: ViewProps) => {
  return (
    <div className="activity-data">
      <div dangerouslySetInnerHTML={{ __html: value || '' }} className="break-long-words" />
    </div>
  );
};
