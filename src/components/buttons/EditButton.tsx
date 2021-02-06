import React from 'react';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { ButtonProps } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';

export const EditButton: React.FC<ButtonProps> = (props: ButtonProps) => {
  return (
    <Tooltip title="Modifier" aria-label="Modifier">
      <IconButton {...props} size="small">
        <EditIcon />
      </IconButton>
    </Tooltip>
  );
};
