import React from 'react';

import { H5p } from 'src/components/H5p';

import type { ViewProps } from '../editing.types';

export const H5pView: React.FC<ViewProps> = ({ value }: ViewProps) => {
  return (
    <div className="text-center activity-data">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <H5p src={value} />
      </div>
    </div>
  );
};
