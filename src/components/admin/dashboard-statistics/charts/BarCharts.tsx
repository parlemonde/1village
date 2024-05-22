import React from 'react';

import { BarChart } from '@mui/x-charts/BarChart';

import styles from '../styles/charts.module.css';

type BarChartDataItem = {
  data: number[];
};

interface Props {
  barChartData: BarChartDataItem[];
}

const BarCharts: React.FC<Props> = ({ barChartData }) => {
  const seriesData = barChartData.map((item) => ({ data: item.data }));
  return (
    <div className={styles.barContainer}>
      <div className={styles.title}>Evolution des connexions</div>
      <BarChart 
        xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]} 
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
