import React from 'react';

interface AdminTileProps {
  title: string;
  selectLanguage?: React.ReactNode | null;
  toolbarButton?: React.ReactNode | null;
  style?: React.CSSProperties;
}

import Paper from '@material-ui/core/Paper';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import type { Theme as MaterialTheme } from '@material-ui/core/styles';
import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: MaterialTheme) =>
  createStyles({
    toolbar: {
      backgroundColor: theme.palette.secondary.main,
      color: 'white',
      fontWeight: 'bold',
      minHeight: 'unset',
      padding: '8px 8px 8px 16px',
    },
    title: {
      flex: '1 1 100%',
      padding: '6px 0',
    },
  }),
);

export const AdminTile: React.FC<AdminTileProps> = ({
  title,
  children = null,
  toolbarButton = null,
  selectLanguage = null,
  style = {},
}: React.PropsWithChildren<AdminTileProps>) => {
  const classes = useStyles();
  return (
    <Paper style={{ ...style, overflow: 'hidden' }}>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h2" id="themetabletitle" component="div" className={classes.title}>
          {title} {selectLanguage}
        </Typography>
        {toolbarButton}
      </Toolbar>
      {children}
    </Paper>
  );
};
