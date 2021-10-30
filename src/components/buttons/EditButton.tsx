import React from 'react';

import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import type { Theme } from '@mui/material/styles';
import type { ButtonProps } from '@mui/material';
import { makeStyles, createStyles } from '@mui/styles';

import { successColor, errorColor, warningColor } from 'src/styles/variables.const';

interface EditButtonProps extends ButtonProps {
  color?: 'primary' | 'secondary' | 'default';
  status?: 'warning' | 'success' | 'error' | null;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
      border: `1px solid ${theme.palette.primary.main}`,
    },
    secondary: {
      border: `1px solid ${theme.palette.secondary.main}`,
    },
    default: {
      border: `1px solid ${theme.palette.grey[400]}`,
    },
  }),
);

export const EditButton = ({ color = 'default', status = null, ...props }: EditButtonProps) => {
  const classes = useStyles();

  return (
    <Tooltip title="Modifier" aria-label="Modifier">
      <IconButton {...props} size="small" color={color} className={classes[status ? status : color]}>
        <EditIcon />
      </IconButton>
    </Tooltip>
  );
};
