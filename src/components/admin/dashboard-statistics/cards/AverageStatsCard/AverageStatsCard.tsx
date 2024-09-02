import React from 'react';

import styles from './AverageStatsCard.module.css';

interface DetailedStatsCardProps {
  children: React.ReactNode;
  icon?: React.ReactNode | null;
  unit?: string | null;
  data: {
    min: number;
    max: number;
    average: number;
    median: number;
  };
}

const AverageStatsCard = ({ children, icon = null, unit = null, data }: DetailedStatsCardProps) => {
  return (
    <div className={styles.cardContainer}>
      <p>{children}</p>
      <div className={styles.cardContainerAverage}>
        {icon && <p>{icon}</p>}
        <p>{data.average}</p>
        {unit && <p>{unit}</p>}
      </div>
      <div className={styles.cardContainerFooter}>
        <div>
          <p>
            Maximum: {data.max} {unit && <span>{unit}</span>}
          </p>
        </div>
        <div>
          <p>
            Médiane: {data.median} {unit && <span>{unit}</span>}
          </p>
        </div>
        <div>
          <p>
            Minimum: {data.min} {unit && <span>{unit}</span>}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AverageStatsCard;
