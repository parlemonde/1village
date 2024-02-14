import Image from 'next/image';
import React from 'react';

import type { InstrumentsType } from './instruments';

interface InstrumentsIconsProps {
  instruments: InstrumentsType[];
}

const InstrumentsIcons: React.FC<InstrumentsIconsProps> = ({ instruments }) => {
  return (
    <>
      {instruments.map((instrument, index) => (
        <div key={index}>
          <Image src={instrument.svg} alt={instrument.name} width={32} height={32} />
        </div>
      ))}
    </>
  );
};

export default InstrumentsIcons;
