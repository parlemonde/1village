import React from 'react';

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

type InlineProps = {
  value: {
    BOLD: boolean;
    ITALIC: boolean;
    UNDERLINE: boolean;
  };
  onChange(type: 'BOLD' | 'ITALIC' | 'UNDERLINE', value: boolean): void;
};

export const InlineButtons = ({ value, onChange }: InlineProps) => {
  const formats = React.useMemo(
    () =>
      Object.keys(value)
        .filter((key) => ['BOLD', 'ITALIC', 'UNDERLINE'].includes(key))
        .filter((key) => value[key as 'BOLD' | 'ITALIC' | 'UNDERLINE']),
    [value],
  );

  return (
    <ToggleButtonGroup
      size="small"
      value={formats}
      aria-label="text formatting"
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
        value="BOLD"
        aria-label="bold"
        onMouseDown={(event: React.MouseEvent<HTMLElement>) => {
          event.preventDefault();
          onChange('BOLD', !value.BOLD);
        }}
      >
        <FormatBoldIcon />
      </ToggleButton>
      <ToggleButton
        value="ITALIC"
        aria-label="italic"
        onMouseDown={(event: React.MouseEvent<HTMLElement>) => {
          event.preventDefault();
          onChange('ITALIC', !value.ITALIC);
        }}
      >
        <FormatItalicIcon />
      </ToggleButton>
      <ToggleButton
        value="UNDERLINE"
        aria-label="underline"
        onMouseDown={(event: React.MouseEvent<HTMLElement>) => {
          event.preventDefault();
          onChange('UNDERLINE', !value.UNDERLINE);
        }}
      >
        <FormatUnderlinedIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};
