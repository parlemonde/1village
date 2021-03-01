import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Avatar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(18),
    height: theme.spacing(18),
  },
  medium: {
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
}));

type AvatarViewProps = {
  value: string;
  size?: 'large' | 'medium';
  onClick?: () => void;
  children?: React.ReactNode;
};
export const AvatarView: React.FC<AvatarViewProps> = ({ size = 'large', value, children, onClick = () => {} }: AvatarViewProps) => {
  const classes = useStyles();
  return (
    <Avatar alt={'avatar'} className={classes[size]} src={value} onClick={onClick}>
      {children}
    </Avatar>
  );
};
