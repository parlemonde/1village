import * as React from 'react';

import { PieChart } from '@mui/x-charts/PieChart/PieChart';

import styles from './../styles/charts.module.css';

export default function PieChartComponent() {
  const title = 'title';
  const data = [
    { id: 0, value: 10, label: 'series A' },
    { id: 1, value: 15, label: 'series B' },
    { id: 2, value: 20, label: 'series C' },
  ];
  return (
    <div className={styles.pieChartContainer}>
      <h1>{title}</h1>
      <PieChart
        series={[
          {
            data,
          },
        ]}
        width={400}
        height={200}
      />
    </div>
  );
}
