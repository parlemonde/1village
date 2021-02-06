import React from 'react';

import type { PreviewProps } from '../editing.types';

export const TextPreview: React.FC<PreviewProps> = ({ value }: PreviewProps) => {
  return (
    <div className="text-preview">
      <div dangerouslySetInnerHTML={{ __html: value }} />
    </div>
  );
};
