import React from 'react';

import type { ViewProps } from '../editing.types';

export const TextView: React.FC<ViewProps> = ({ value }: ViewProps) => {
  return (
    <div className="activity-data">
      <div dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  );
};
