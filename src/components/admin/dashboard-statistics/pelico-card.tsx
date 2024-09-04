import Image from 'next/image';
import React from 'react';

// interface PelicoMessage {
//   message: string;
// }

export const PelicoCard = (message: { message }) => {
  return (
    <>
      <div style={{ width: '100%', maxWidth: '20rem', margin: '4rem auto', backgroundColor: bgPage, padding: '1rem', borderRadius: '10px' }}>
        <p style={{ textAlign: 'center' }} className="text">
          {message}
        </p>
        <Image src="/pelico-question.png" alt="image" style={{ width: '60%', height: 'auto', margin: '0 20%' }} />
        <p className="text" style={{ textDecorationLine: 'underline', margin: '0 25%' }}></p>
      </div>
    </>
  );
};
