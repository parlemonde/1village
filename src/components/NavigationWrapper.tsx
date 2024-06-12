import React, { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

import { Navigation } from './Navigation';
import { VillageSelect } from './VillageSelect';

export const NavigationWrapper = (): JSX.Element => {
  const [open, setState] = useState(false);

  /*
  The keys tab and shift are excluded so the user can focus between
  the elements with the keys
  */
  const toggleDrawer = (open: boolean) => (event: { type?: string; key?: string }) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState(open);
  };

  return (
    <>
      {/* Desktop view */}
      <Grid
        item
        xs={12}
        md={4}
        lg={3}
        xl={2}
        className="sticky"
        sx={{
          top: '96px',
          height: 'fit-content',
          display: {
            xs: 'none',
            md: 'block',
          },
        }}
      >
        <Navigation />
      </Grid>
      {/* Mobile view */}
      <Grid
        className="with-shadow sticky"
        item
        xs={12}
        sx={{
          display: {
            top: '70px',
            xs: 'block',
            md: 'none',
            zIndex: '99',
            width: '100%',
            backgroundColor: 'white',
            padding: '0.5rem',
          },
        }}
      >
        <div
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <IconButton edge="start" color="inherit" aria-label="Ouvrir le menu" onClick={toggleDrawer(true)}>
            <MenuIcon fontSize="large" />
          </IconButton>
          <VillageSelect />
        </div>
        <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
          <Box
            sx={{
              p: 2,
              height: 1,
              width: '320px',
            }}
          >
            <IconButton sx={{ mb: 2 }} onClick={toggleDrawer(false)}>
              <CloseIcon />
            </IconButton>

            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Navigation />
            </Box>
          </Box>
        </Drawer>
      </Grid>
    </>
  );
};
