import React from 'react';

import Box from '@mui/material/Box';

import styles from './StatsCard.module.css';

interface StatsCardProps {
  children: React.ReactNode;
  data: number | undefined;
}
const StatsCard = ({ children, data }: StatsCardProps) => {
  return (
    <Box
      className={styles.cardContainer}
      sx={{
        margin: {
          xs: '0',
          md: '0 1rem',
        },
      }}
    >
      <p>{children}</p>
      <p>{data ?? 0}</p>
    </Box>
  );
};

export default StatsCard;
