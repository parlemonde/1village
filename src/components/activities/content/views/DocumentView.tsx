import React from 'react';

import type { ViewProps } from '../content.types';
import PdfDisplay from '../editors/DocumentEditor/PdfDisplay';

export const DocumentView = ({ value = '' }: ViewProps) => {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
      <PdfDisplay url={value} />
    </div>
  );
};
