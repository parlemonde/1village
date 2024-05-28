import React from 'react';

import { BarChart } from '@mui/x-charts/BarChart';

import styles from '../styles/charts.module.css';

type BarChartDataItem = {
  data: number[];
};

interface Props {
  barChartData: BarChartDataItem[];
}

//add isSelected to change colors #4339F2 or #DAD7FE

const BarCharts: React.FC<Props> = ({ barChartData }) => {
  const seriesData = barChartData.map((item) => ({ data: item.data }));
  return (
    <div className={styles.barContainer}>
      <div className={styles.title}>Evolution des connexions</div>
      <BarChart
        xAxis={[
          {
            scaleType: 'band',
            data: ['group A', 'group B', 'group C'],
            colorMap: {
              type: 'piecewise',
              thresholds: [new Date(2021, 1, 1), new Date(2023, 1, 1)],
              colors: ['#DAD7FE'],
            },
          },
        ]}
        series={seriesData}
        slotProps={{
          bar: {
            clipPath: `inset(0px round 40px)`,
          },
        }}
      />
    </div>
  );
};

export default BarCharts;
