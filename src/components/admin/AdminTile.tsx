import React from 'react';

import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';

interface AdminTileProps {
  title: string;
  selectLanguage?: React.ReactNode | null;
  toolbarButton?: React.ReactNode | null;
  style?: React.CSSProperties;
}

export const AdminTile = ({
  title,
  children = null,
  toolbarButton = null,
  selectLanguage = null,
  style = {},
}: React.PropsWithChildren<AdminTileProps>) => {
  return (
    <Paper style={{ ...style, boxShadow: 'none' }}>
      <Toolbar
        sx={{
          color: 'black',
          minHeight: 'unset',
          padding: '8px 0',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
        disableGutters
      >
        <p style={{ flexBasis: '50%', padding: '6px 0' }}>
          {title} {selectLanguage}
        </p>
        <div style={{ marginLeft: 'auto' }}>{toolbarButton}</div>
      </Toolbar>
      {children}
    </Paper>
  );
};
