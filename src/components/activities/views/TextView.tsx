import classnames from 'classnames';
import React from 'react';

import type { ViewProps } from '../editing.types';

export const TextView: React.FC<ViewProps> = ({ value, isPreview }: ViewProps) => {
  return (
    <div
      className={classnames({
        'text-preview': isPreview,
        'activity-data': !isPreview,
      })}
    >
      <div dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  );
};
