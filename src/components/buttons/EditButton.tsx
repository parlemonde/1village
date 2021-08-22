import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import type { Theme } from '@material-ui/core/styles';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import type { ButtonProps } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

import { successColor } from 'src/styles/variables.const';

interface EditButtonProps extends ButtonProps {
  color?: 'primary' | 'secondary' | 'default';
  isGreen?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    green: {
      border: `1px solid ${successColor}`,
      color: successColor,
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

export const EditButton = ({ color = 'default', isGreen = false, ...props }: EditButtonProps) => {
  const classes = useStyles();

  return (
    <Tooltip title="Modifier" aria-label="Modifier">
      <IconButton {...props} size="small" color={color} className={classes[isGreen ? 'green' : color]}>
        <EditIcon />
      </IconButton>
    </Tooltip>
  );
};
