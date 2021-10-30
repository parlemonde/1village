import React from 'react';

import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import type { Theme } from '@mui/material/styles';
import type { ButtonProps } from '@mui/material';

import { successColor, errorColor, warningColor } from 'src/styles/variables.const';

interface EditButtonProps extends ButtonProps {
  color?: 'primary' | 'secondary' | 'inherit';
  status?: 'warning' | 'success' | 'error' | null;
}

const styles = {
  success: {
    border: `1px solid ${successColor}`,
    color: successColor,
  },
  error: {
    border: `1px solid ${errorColor}`,
    color: errorColor,
  },
  warning: {
    border: `1px solid ${warningColor}`,
    color: warningColor,
  },
  primary: {
    border: (theme: Theme) => `1px solid ${theme.palette.primary.main}`,
  },
  secondary: {
    border: (theme: Theme) => `1px solid ${theme.palette.secondary.main}`,
  },
  inherit: {
    border: (theme: Theme) => `1px solid ${theme.palette.grey[400]}`,
    color: (theme: Theme) => theme.palette.text.primary,
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
};

export const EditButton = ({ color = 'inherit', status = null, ...props }: EditButtonProps) => {
  return (
    <Tooltip title="Modifier" aria-label="Modifier">
      <IconButton {...props} size="small" color={color} sx={styles[status ? status : color]}>
        <EditIcon />
      </IconButton>
    </Tooltip>
  );
};
