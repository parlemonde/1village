import React from 'react';

import type { ViewProps } from '../content.types';

export const TextView: React.FC<ViewProps> = ({ value }: ViewProps) => {
  return (
    <div className="activity-data">
      <div dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  );
};
