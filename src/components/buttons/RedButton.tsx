import Button from '@mui/material/Button';
import { withStyles } from '@mui/styles';

import { errorColor, errorColorDarker } from 'src/styles/variables.const';

export const RedButton = withStyles(() => ({
  root: {
    color: 'white',
    backgroundColor: errorColor,
    '&:hover': {
      backgroundColor: errorColorDarker,
    },
  },
}))(Button);
