import React from 'react';

import styles from './StatsCard.module.css';

interface StatsCardProps {
  children: React.ReactNode;
  data: number;
}
const StatsCard = ({ children, data }: StatsCardProps) => {
  return (
    <div className={styles.cardContainer}>
      <p>{children}</p>
      <p>{data}</p>
    </div>
  );
};

export default StatsCard;
