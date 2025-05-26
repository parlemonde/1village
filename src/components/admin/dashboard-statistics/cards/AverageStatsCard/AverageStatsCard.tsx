import React from 'react';

import styles from './AverageStatsCard.module.css';
import { valueOrDefault } from 'src/utils/valueOrDefaultAt';
import type { AverageStatsData } from 'types/dashboard.type';
import { AverageStatsProcessingMethod } from 'types/dashboard.type';

interface AverageStatsCardProps {
  children: React.ReactNode;
  icon?: React.ReactNode | null;
  unit?: string | null;
  data: AverageStatsData;
  processingMethod?: AverageStatsProcessingMethod;
}

const AverageStatsCard = ({
  children,
  icon = null,
  unit = null,
  data,
  processingMethod = AverageStatsProcessingMethod.NO_PROCESSING,
}: AverageStatsCardProps) => {
  const processValue = (value: number | undefined): number => {
    const valueNotUndefined = valueOrDefault(value, 0);

    switch (processingMethod) {
      case AverageStatsProcessingMethod.BY_MIN:
        return Math.floor(valueNotUndefined) / 60;
      case AverageStatsProcessingMethod.NO_PROCESSING:
      default:
        return valueNotUndefined;
    }
  };

  return (
    <div className={styles.cardContainer}>
      <p>{children}</p>
      <div className={styles.cardContainerAverage}>
        {icon && <p>{icon}</p>}
        <p>{processValue(data.average)}</p>
        {unit && <p>{unit}</p>}
      </div>
      <div className={styles.cardContainerFooter}>
        <div>
          <p>
            Maximum: {processValue(data.max)} {unit && <span>{unit}</span>}
          </p>
        </div>
        <div>
          <p>
            Médiane: {processValue(data.median)} {unit && <span>{unit}</span>}
          </p>
        </div>
        <div>
          <p>
            Minimum: {processValue(data.min)} {unit && <span>{unit}</span>}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AverageStatsCard;
