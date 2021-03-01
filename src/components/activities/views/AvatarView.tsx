import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(18),
    height: theme.spacing(18),
  },
}));

type AvatarViewProps = {
  value: string;
};
export const AvatarView: React.FC<AvatarViewProps> = ({ value }: AvatarViewProps) => {
  const classes = useStyles();
  return (
    <Box display="flex" justifyContent="center" m={4}>
      <Avatar alt={'avatar'} className={classes.large} src={value} />
    </Box>
  );
};
