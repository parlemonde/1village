import classNames from 'classnames';
import React from 'react';

import { PieChart } from '@mui/x-charts/PieChart';

import styles from '../styles/charts.module.css';

type PieChartDataItem = {
  id: number;
  value: number;
  label: string;
};

type PieChartData = {
  data: PieChartDataItem[];
};

interface Props {
  pieChartData: PieChartData;
  className?: string;
}

const PieCharts: React.FC<Props> = ({ pieChartData, className }) => {
  const labels = pieChartData.data.map((item) => item.label);

  return (
    <div className={classNames(styles.pieContainer, className)}>
      <div className={styles.title}>Niveau engagement</div>
      <PieChart series={[{ data: pieChartData.data }]} width={400} height={200} />
      <div className={`${styles.legend}`}>
        {labels.map((label, index) => (
          <div key={index} className={styles.legendItem}>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieCharts;
