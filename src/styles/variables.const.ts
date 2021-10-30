// ! Synchronize this file with ./_variables.scss
import type { Theme } from '@mui/material/styles';

// fonts
export const fontColor = '#2e343b';
export const fontDetailColor = '#666666';

// colors
export const primaryColor = '#4c3ed9';
export const primaryColorLight = '#DEDFFF';
export const primaryColorLight2 = '#b3b5fc';
export const secondaryColor = '#80cbc4';
export const helpColor = '#e1c7d1';
export const helpColorDarker = '#cfbac3';
export const successColor = '#008000';
export const errorColor = '#d93939';
export const errorColorDarker = '#ad2d2d';
export const warningColor = '#CA8621';
export const bgPage = '#f5f5f5';

// ---- Support MaterialUI V4 default button style ----
export const defaultContainedButtonStyle = {
  color: (theme: Theme) => theme.palette.text.primary,
  backgroundColor: '#e0e0e0',
  '&:hover': {
    backgroundColor: '#d5d5d5',
  },
};
export const defaultTextButtonStyle = {
  color: (theme: Theme) => theme.palette.text.primary,
  '&:hover': {
    backgroundColor: '#f5f5f5',
  },
};
export const defaultOutlinedButtonStyle = {
  color: (theme: Theme) => theme.palette.text.primary,
  border: '1px solid #c5c5c5',
  '&:hover': {
    backgroundColor: '#f5f5f5',
    border: '1px solid #c5c5c5',
  },
};
