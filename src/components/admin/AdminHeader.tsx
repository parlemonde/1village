import Link from 'next/link';
import React from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import type { Theme } from '@material-ui/core/styles';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import { Button } from '@material-ui/core';

interface ElevationScrollProps {
  children: React.ReactElement;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
  }),
);

function ElevationScroll({ children }: ElevationScrollProps) {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });
  return React.cloneElement(children, {
    elevation: trigger ? 4 : 0,
  });
}

export const AdminHeader = () => {
  const classes = useStyles();

  return (
    <>
      <ElevationScroll>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar variant="dense">
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              1Village - Administrateur
            </Typography>
            <Link href="/" passHref>
              <Button component="a" href="/" variant="contained" size="small" style={{ margin: '0 1rem' }}>
                Aller au village
              </Button>
            </Link>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Toolbar variant="dense"></Toolbar>
    </>
  );
};
