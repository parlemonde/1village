import Image from 'next/image';
import React from 'react';

// interface PelicoMessage {
//   message: string;
// }

// add message props en fonction de l'onglet
export const PelicoCard = () => {
  return (
    <>
      <div style={{ width: '100%', maxWidth: '20rem', margin: '4rem auto', backgroundColor: 'grey', padding: '1rem', borderRadius: '10px' }}>
        <p style={{ textAlign: 'center' }} className="text">
          message de Pelico
          {/* {message} */}
        </p>
        <Image src="/pelico-question.png" alt="image" style={{ width: '60%', height: 'auto', margin: '0 20%' }} />
        <p className="text" style={{ textDecorationLine: 'underline', margin: '0 25%' }}></p>
      </div>
    </>
  );
};
