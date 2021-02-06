import classnames from 'classnames';
import React from 'react';

import { H5p } from 'src/components/H5p';

import type { ViewProps } from '../editing.types';

export const H5pView: React.FC<ViewProps> = ({ value, isPreview }: ViewProps) => {
  return (
    <div
      className={classnames('text-center', {
        'text-preview': isPreview,
        'activity-data': !isPreview,
      })}
    >
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <H5p src={value} />
      </div>
    </div>
  );
};
