import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import React from 'react';

type TitleChoiceProps = {
  value: 'unstyle' | 'header-one' | 'header-two';
  onChange(value: 'header-one' | 'header-two'): void;
};

export const TitleChoice = ({ value, onChange }: TitleChoiceProps) => {
  return (
    <ToggleButtonGroup
      size="small"
      aria-label="text size"
      value={value}
      sx={{
        '& .MuiToggleButtonGroup-grouped': {
          m: 0.5,
          border: 'none',
          '&:not(:first-of-type)': {
            borderRadius: '4px',
          },
          '&:not(:last-of-type)': {
            borderRadius: '4px',
          },
        },
      }}
    >
      <ToggleButton
        aria-label="left aligned"
        value="header-one"
        onMouseDown={(event: React.MouseEvent<HTMLElement>) => {
          event.preventDefault();
          onChange('header-one');
        }}
      >
        Titre 1
      </ToggleButton>
      <ToggleButton
        aria-label="centered"
        value="header-two"
        onMouseDown={(event: React.MouseEvent<HTMLElement>) => {
          event.preventDefault();
          onChange('header-two');
        }}
      >
        Titre 2
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
