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
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState(open);
  };

  return (
    <>
      {/* Desktop view */}
      <Grid
        className="sticky"
        item
        xs={12}
        sm={4}
        lg={3}
        xl={2}
        sx={{
          top: '96px',
          height: 'fitContent',
          display: {
            // TODO: Second phase of responsive: uncomment the 2 next lines.
            xs: 'none',
            sm: 'block',
          },
        }}
      >
        <Navigation />
      </Grid>
      {/* Mobile view */}
      <Grid
        className="sticky with-shadow"
        item
        xs={12}
        sx={{
          display: {
            xs: 'block',
            sm: 'none',
            zIndex: '99',
            top: '60px',
            width: '100%',
            backgroundColor: 'white',
            margin: '1rem 0',
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
          <IconButton edge="start" color="inherit" aria-label="open drawer" onClick={toggleDrawer(true)}>
            <MenuIcon fontSize="large" />
          </IconButton>
          <VillageSelect />
        </div>
        <Drawer anchor="left" open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
          <Box
            sx={{
              p: 2,
              height: 1,
            }}
          >
            <IconButton sx={{ mb: 2 }}>
              <CloseIcon onClick={toggleDrawer(false)} />
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
