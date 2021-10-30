import React from 'react';

import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import type { Theme } from '@mui/material/styles';
import { withStyles } from '@mui/styles';

const StyledToggleButtonGroup = withStyles((theme: Theme) => ({
  grouped: {
    margin: theme.spacing(0.5),
    border: 'none',
    '&:not(:first-child)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-child': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}))(ToggleButtonGroup);

type TitleChoiceProps = {
  value: 'unstyle' | 'header-one' | 'header-two';
  onChange(value: 'header-one' | 'header-two'): void;
};

export const TitleChoice = ({ value, onChange }: TitleChoiceProps) => {
  return (
    <StyledToggleButtonGroup size="small" aria-label="text size" value={value}>
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
    </StyledToggleButtonGroup>
  );
};
