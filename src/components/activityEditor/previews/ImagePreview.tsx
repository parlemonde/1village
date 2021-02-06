import React from 'react';

import type { PreviewProps } from '../editing.types';

export const ImagePreview: React.FC<PreviewProps> = ({ value }: PreviewProps) => {
  return (
    <div className="text-preview text-center">
      <div
        style={{
          display: 'inline-block',
          width: '15rem',
          height: '10rem',
          backgroundImage: `url(${value})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      ></div>
    </div>
  );
};
