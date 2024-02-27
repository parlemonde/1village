import React from 'react';

import styles from './instruments.module.css';

interface InstrumentsType {
  instrumentName: string;
}

export const InstrumentSvg = ({ instrumentName }: InstrumentsType) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img className={styles.svgContainer} src={`/static-images/anthem/${instrumentName.toLowerCase()}.svg`}></img>
  );
};
