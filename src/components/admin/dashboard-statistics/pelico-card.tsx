import Image from 'next/image';
import React from 'react';

import { bgPage } from 'src/styles/variables.const';

interface Message {
  message: string;
}

export const PelicoCard = ({ message }: Message) => {
  return (
    <div style={{ width: '100%', maxWidth: '20rem', margin: '4rem auto', backgroundColor: bgPage, padding: '1rem', borderRadius: '10px' }}>
      <p style={{ textAlign: 'center' }} className="text">
        {message}
      </p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '33%', position: 'relative' }}>
          <Image src="/static-images/pelico-question.png" alt="Pelico question" layout="responsive" width={300} height={300} objectFit="contain" />
        </div>
      </div>
      <p className="text" style={{ textDecorationLine: 'underline', margin: '0 25%' }}></p>
    </div>
  );
};
