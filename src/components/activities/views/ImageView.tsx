import classnames from 'classnames';
import React from 'react';

import type { ViewProps } from '../editing.types';

export const ImageView: React.FC<ViewProps<string | File>> = ({ value, isPreview }: ViewProps<string | File>) => {
  return (
    <div
      className={classnames('text-center', {
        'text-preview': isPreview,
        'activity-data': !isPreview,
      })}
    >
      {isPreview ? (
        <div
          style={{
            display: 'inline-block',
            width: '15rem',
            height: '10rem',
            backgroundImage: `url(${typeof value === 'string' ? value : URL.createObjectURL(value)})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        ></div>
      ) : (
        <img
          style={{ width: '100%', maxWidth: '600px', height: 'auto', display: 'block', margin: '0 auto' }}
          src={typeof value === 'string' ? value : URL.createObjectURL(value)}
        />
      )}
    </div>
  );
};
