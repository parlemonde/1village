import Link from 'next/link';
import React from 'react';

import { Button } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';

import { defaultContainedButtonStyle } from 'src/styles/variables.const';

interface ElevationScrollProps {
  children: React.ReactElement;
}

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
  return (
    <>
      <ElevationScroll>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar variant="dense">
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              1Village - Administrateur
            </Typography>
            <Link href="/" passHref>
              <Button
                color="inherit"
                sx={defaultContainedButtonStyle}
                component="a"
                href="/"
                variant="contained"
                size="small"
                style={{ margin: '0 1rem' }}
              >
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
