import { frFR } from '@mui/material/locale';
import { createTheme } from '@mui/material/styles';

import { primaryColor, secondaryColor, successColor, errorColor, bgPage } from './variables.const';

const theme = createTheme(
  {
    palette: {
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: secondaryColor,
      },
      background: {
        default: bgPage,
      },
      error: {
        main: errorColor,
      },
      success: {
        main: successColor,
      },
    },
    typography: {
      fontFamily: ['Roboto', 'Arial', 'sans-serif'].join(','),
      fontSize: 14,
      h1: {
        fontSize: '1.8rem',
        fontWeight: 600,
        margin: '1.2rem 0 1rem 0',
      },
      h2: {
        fontSize: '1.357rem',
        fontWeight: 600,
        margin: 0,
      },
      h3: {
        fontSize: '1.07rem',
        fontWeight: 600,
        margin: 0,
      },
      button: {
        fontSize: '0.95rem',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '12px',
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          shrink: {
            transform: 'translate(0, 1.5px) scale(0.9)',
          },
        },
      },
    },
  },
  frFR,
);

export default theme;
