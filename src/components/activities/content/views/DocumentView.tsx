import React from 'react';

import type { ViewProps } from '../content.types';
import PdfDisplay from '../editors/DocumentEditor/PdfDisplay';
import { LightBox } from 'src/components/lightbox/Lightbox';

export const DocumentView = ({ value = '' }: ViewProps) => {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
      <LightBox url={value} isImage={false}>
        <PdfDisplay url={value} />
      </LightBox>
    </div>
  );
};
