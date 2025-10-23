import React from 'react';

import Box from '@mui/material/Box';

import styles from './StatsCard.module.css';

interface Style {
  width?: string;
  height?: string;
}
interface StatsCardProps {
  children: React.ReactNode;
  data: number | undefined;
  style?: Style | undefined;
}

const StatsCard = ({ children, data, style }: StatsCardProps) => {
  return (
    <Box
      className={`${styles.root} ${styles.cardContainer}`}
      sx={{
        margin: {
          xs: '0',
          md: '0 1rem',
        },
      }}
      style={{
        width: style?.width ?? '100%',
        height: style?.height ?? '100%',
      }}
    >
      <p>{children}</p>
      <p>{data ?? 0}</p>
    </Box>
  );
};

export default StatsCard;
