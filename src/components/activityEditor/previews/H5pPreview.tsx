import React from 'react';

import { H5p } from 'src/components/H5p';

import type { PreviewProps } from '../editing.types';

export const H5pPreview: React.FC<PreviewProps> = ({ value }: PreviewProps) => {
  return (
    <div className="text-preview text-center">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <H5p src={value} />
      </div>
    </div>
  );
};
