import React from 'react';

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
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
    <StyledToggleButtonGroup size="small" value={formats} aria-label="text formatting">
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
    </StyledToggleButtonGroup>
  );
};
