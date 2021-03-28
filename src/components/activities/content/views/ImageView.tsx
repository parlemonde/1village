import React from 'react';

import type { ViewProps } from '../content.types';

export const ImageView: React.FC<ViewProps> = ({ value }: ViewProps) => {
  return (
    <div className="text-center activity-data">
      <img style={{ width: '100%', maxWidth: '600px', height: 'auto', display: 'block', margin: '0 auto' }} src={value} />
    </div>
  );
};
