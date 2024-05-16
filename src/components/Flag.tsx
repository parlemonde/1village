import React from 'react';
import type { Country } from 'server/entities/country';

import MysteryFlag from 'src/svg/mystery-flag.svg';

const sizes = {
  small: 12,
  medium: 18,
};

interface FlagProps {
  isMistery?: boolean;
  country?: Country;
  size?: 'small' | 'medium';
  style?: React.CSSProperties;
}
export const Flag = ({ country, isMistery = false, size = 'medium', style = {} }: FlagProps) => {
  if (!country || isMistery) {
    return <MysteryFlag style={{ ...style, width: 'auto', height: sizes[size], borderRadius: '2px' }} />;
  }
  return (
    // Small SVG, no need of improvments
    // eslint-disable-next-line @next/next/no-img-element
    <img
      style={{ ...style, width: 'auto', height: sizes[size], borderRadius: '2px' }}
      src={`/country-flags/${country.isoCode.toLowerCase()}.svg`}
    ></img>
  );
};
