import React from 'react';

import { Grid } from '@mui/material';

import { NavigationWrapper } from './NavigationWrapper';
import { SubHeaders } from 'src/components/accueil/SubHeader';

interface BaseProps {
  rightNav?: React.ReactNode | React.ReactNodeArray;
  hideLeftNav?: boolean;
  showSubHeader?: boolean;
  style?: React.CSSProperties;
}

export const Base = ({ children, rightNav, hideLeftNav = false, showSubHeader = false, style }: React.PropsWithChildren<BaseProps>) => {
  return (
    <Grid
      container
      xs={12}
      sx={{
        marginTop: {
          md: '96px',
        },
        padding: '0 20px',
      }}
    >
      {!hideLeftNav && <NavigationWrapper />}
      <Grid
        item
        xs={12}
        md={8}
        lg={9}
        xl={10}
        sx={{
          ...style,
          position: 'relative',
          marginBottom: {
            xs: rightNav ? '20px' : '0',
          },
          marginTop: {
            xs: '90px',
            md: '0',
          },
        }}
      >
        {showSubHeader && (
          <div style={{ height: '40px', marginBottom: '20px' }}>
            <SubHeaders />
          </div>
        )}
        <div className="app-content__card with-shadow">{children}</div>
      </Grid>
      {rightNav && (
        <Grid item xs={12} sm={4} lg={3} xl={2}>
          <aside
            style={{
              marginLeft: '20px',
              marginBottom: '20px',
            }}
          >
            {rightNav}
          </aside>
        </Grid>
      )}
    </Grid>
  );
};
