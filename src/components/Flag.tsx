import React from 'react';

const sizes = {
  small: 12,
  medium: 18,
};

interface FlagProps {
  country: string;
  size?: 'small' | 'medium';
  style?: React.CSSProperties;
}

export const Flag = ({ country, size = 'medium', style = {} }: FlagProps) => {
  return (
    // Small SVG, no need of improvments
    // eslint-disable-next-line @next/next/no-img-element
    <img style={{ ...style, width: 'auto', height: sizes[size], borderRadius: '2px' }} src={`/country-flags/${country.toLowerCase()}.svg`}></img>
  );
};
