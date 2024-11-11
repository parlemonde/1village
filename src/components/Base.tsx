import { Box, Grid } from '@mui/material';
import React from 'react';

import { Navigation } from './Navigation';
import { NavigationMobile } from './NavigationMobile';
import { SubHeaders } from 'src/components/accueil/SubHeader';

interface BaseProps {
  rightNav?: React.ReactNode | React.ReactNodeArray;
  hideLeftNav?: boolean;
  showSubHeader?: boolean;
  style?: React.CSSProperties;
}

export const Base = ({ children, rightNav, hideLeftNav = false, showSubHeader = false, style }: React.PropsWithChildren<BaseProps>) => {
  return (
    <>
      {/*mobile*/}
      <Grid
        container
        display={{
          xs: 'block',
          md: 'none',
        }}
      >
        {!hideLeftNav && <NavigationMobile />}
        {showSubHeader && (
          <Box sx={{ height: '40px', marginBottom: '10px', marginTop: '70px' }}>
            <SubHeaders />
          </Box>
        )}
        <Box sx={{ marginTop: showSubHeader ? '0' : '70px', padding: { xs: '0.25rem', sm: '0.5rem' } }} className="app-content__card with-shadow">
          {children}
        </Box>
        {rightNav && (
          <Grid
            item
            xs={12}
            md={4}
            lg={3}
            xl={2}
            sx={{
              marginTop: '20px',
            }}
          >
            {rightNav}
          </Grid>
        )}
      </Grid>

      {/**Desktop*/}
      <Grid
        container
        sx={{
          marginTop: '96px',
          padding: '0 20px',
          display: {
            xs: 'none',
            md: 'flex',
          },
        }}
      >
        {!hideLeftNav && (
          <Grid
            item
            md={4}
            lg={3}
            xl={2}
            className="sticky"
            sx={{
              top: '96px',
              height: 'fit-content',
            }}
          >
            <Navigation />
          </Grid>
        )}

        <Grid
          item
          md={8}
          lg={9}
          xl={10}
          sx={{
            ...style,
            marginBottom: rightNav ? '20px' : '0',
          }}
        >
          {showSubHeader && (
            <div style={{ height: '40px', marginBottom: '20px' }}>
              <SubHeaders />
            </div>
          )}
          <Box sx={{ padding: '0.5rem 1.2rem', margin: 0 }} className="app-content__card with-shadow">
            {children}
          </Box>
        </Grid>

        {rightNav && (
          <Grid
            item
            md={4}
            lg={3}
            xl={2}
            sx={{
              paddingLeft: '20px',
            }}
          >
            {rightNav}
          </Grid>
        )}
      </Grid>
    </>
  );
};
