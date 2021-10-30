import React from 'react';

import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

type InlineProps = {
  value: 'left' | 'center' | 'right';
  onChange(value: 'left' | 'center' | 'right'): void;
};

export const TextAlignButtons = ({ value, onChange }: InlineProps) => {
  const handleAlignment = (newAlignment: 'left' | 'center' | 'right' | undefined) => (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    onChange(newAlignment);
  };

  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={value}
      aria-label="text alignment"
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
      <ToggleButton value="left" aria-label="left aligned" onMouseDown={handleAlignment('left')}>
        <FormatAlignLeftIcon />
      </ToggleButton>
      <ToggleButton value="center" aria-label="centered" onMouseDown={handleAlignment('center')}>
        <FormatAlignCenterIcon />
      </ToggleButton>
      <ToggleButton value="right" aria-label="right aligned" onMouseDown={handleAlignment('right')}>
        <FormatAlignRightIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
