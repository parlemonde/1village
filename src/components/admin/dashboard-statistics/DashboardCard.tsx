import type { ReactNode } from 'react';

import Box from '@mui/material/Box';
import type { BoxProps } from '@mui/material/Box';

import { bgPage } from 'src/styles/variables.const';

export interface DashboardCardProps extends BoxProps {
  children?: ReactNode;
}

export default function DashboardCard({ children, sx, ...rest }: Readonly<DashboardCardProps>) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding={2}
      borderRadius={6}
      sx={{ backgroundColor: bgPage, ...(sx as object) }}
      {...rest}
    >
      {children}
    </Box>
  );
}
