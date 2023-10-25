import * as React from 'react';

import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';

import { errorColor, errorColorDarker } from 'src/styles/variables.const';

export const RedButton = (props: ButtonProps) => (
  <Button
    {...props}
    sx={{
      color: 'white',
      backgroundColor: errorColor,
      '&:hover': {
        backgroundColor: errorColorDarker,
      },
    }}
  />
);
