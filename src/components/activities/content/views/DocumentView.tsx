import React from 'react';

import type { ViewProps } from '../content.types';
import PdfDisplay from '../editors/DocumentEditor/PdfDisplay';

export const DocumentView = ({ value = '' }: ViewProps) => {
  return (
    <div className="text-center activity-data">
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <PdfDisplay url={value} />
      </div>
    </div>
  );
};
