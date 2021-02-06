import React from 'react';

const sizes = {
  small: '12px',
  medium: '18px',
};

interface FlagProps {
  country: string;
  size?: 'small' | 'medium';
  style?: React.CSSProperties;
}

export const Flag: React.FC<FlagProps> = ({ country, size = 'medium', style = {} }: FlagProps) => {
  return (
    <img style={{ ...style, width: 'auto', height: sizes[size], borderRadius: '2px' }} src={`/country-flags/${country.toLowerCase()}.svg`}></img>
  );
};
