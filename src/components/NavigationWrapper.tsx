import React, { useState } from 'react';

import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';

import { Navigation } from './Navigation';
import ShowFor from './ShowFor';
import { VillageMonde } from './VillageMonde';
import { VillageSelect } from './VillageSelect';
import { UserType } from 'types/user.type';

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
        className="sticky"
        item
        xs={12}
        sx={{
          display: {
            xs: 'flex',
            md: 'none',
          },
          top: '70px',
          zIndex: '99',
          width: '100%',
          height: '50px',
          backgroundColor: 'white',
          padding: '0.5rem',
          alignItems: 'center',
          justifyContent: 'flex-end',
          borderBottom: '1px solid lightgray',
        }}
      >
        <IconButton edge="start" color="inherit" aria-label="Ouvrir le menu" onClick={toggleDrawer(true)}>
          <MenuIcon fontSize="large" />
        </IconButton>
        <Box display="flex" width="100%" justifyContent="center" alignItems="center">
          <ShowFor roles={[UserType.TEACHER, UserType.FAMILY, UserType.OBSERVATOR]}>
            <VillageMonde />
          </ShowFor>
          <VillageSelect />
        </Box>
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
