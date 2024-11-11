import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React from 'react';

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
    <Paper style={{ ...style }}>
      <Toolbar
        sx={{
          backgroundColor: (theme) => theme.palette.secondary.main,
          color: 'white',
          fontWeight: 'bold',
          minHeight: 'unset',
          padding: '8px 8px 8px 16px',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="h2" id="themetabletitle" component="div" sx={{ flexBasis: '50%', padding: '6px 0' }}>
          {title} {selectLanguage}
        </Typography>
        {toolbarButton}
      </Toolbar>
      {children}
    </Paper>
  );
};
