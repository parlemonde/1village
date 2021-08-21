import Image from 'next/image';
import React from 'react';

import { KeepRatio } from 'src/components/KeepRatio';

import type { ViewProps } from '../content.types';

export const ImageView: React.FC<ViewProps> = ({ value }: ViewProps) => {
  return (
    <div className="text-center activity-data">
      <KeepRatio ratio={2 / 3} maxWidth="600px">
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <Image layout="fill" objectFit="contain" src={value} unoptimized />
        </div>
      </KeepRatio>
    </div>
  );
};
