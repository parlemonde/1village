import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import type { Theme } from '@material-ui/core/styles';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import type { ButtonProps } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

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
