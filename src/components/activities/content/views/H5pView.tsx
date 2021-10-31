import React from 'react';

import { H5p } from 'src/components/H5p';

import type { ViewProps } from '../content.types';

export const H5pView = ({ value }: ViewProps) => {
  return (
    <div className="text-center activity-data">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>{value && <H5p src={value} />}</div>
    </div>
  );
};
