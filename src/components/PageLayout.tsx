import React from 'react';

import { Box } from '@mui/material';

type PageLayoutProps = {
  children: React.ReactNode;
};

export const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        width: '100%',
        padding: {
          xs: '0',
          md: '0.5rem 1rem 1rem 1rem',
        },
      }}
    >
      {children}
    </Box>
  );
};
