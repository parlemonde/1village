import Link from 'next/link';
import React from 'react';

import { Button, AppBar, Toolbar, Typography, useScrollTrigger } from '@mui/material';

import { primaryColor, defaultContainedButtonStyle } from 'src/styles/variables.const';
import Logo from 'src/svg/logo.svg';

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

export const NewAdminHeader = () => {
  return (
    <>
      <ElevationScroll>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'white' }}>
          <div className="container-navbar">
            <Logo style={{ width: '40px', height: 'auto' }} />
            <Typography
              variant="h5"
              style={{
                flexGrow: 1,
                color: primaryColor,
                margin: '0px 0px 0px 0.5rem',
                fontFamily: 'Alegreya Sans',
                fontWeight: 500,
                alignSelf: 'center',
              }}
            >
              1Village
            </Typography>

            <Link href="/" passHref>
              <Button
                component="a"
                href="/"
                variant="contained"
                size="small"
                style={{
                  color: primaryColor,
                  background: 'white',
                  border: `1px solid ${primaryColor}`,
                  borderRadius: '10px',
                  alignSelf: 'center',
                  height: '28px',
                  width: '130px',
                }}
              >
                Aller au village
              </Button>
            </Link>
          </div>
        </AppBar>
      </ElevationScroll>
      <Toolbar variant="dense"></Toolbar>
    </>
  );
};
