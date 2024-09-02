import classNames from 'classnames';
import React from 'react';

import { BarChart } from '@mui/x-charts/BarChart';

import styles from '../styles/charts.module.css';

type BarChartDataItem = {
  data: number[];
};

interface Props {
  barChartData: BarChartDataItem[];
  title?: string;
  className?: string;
}

//add isSelected to change colors #4339F2 or #DAD7FE

const BarCharts: React.FC<Props> = ({ barChartData, title, className }) => {
  const seriesData = barChartData.map((item) => ({ data: item.data }));
  return (
    <div className={classNames(styles.barContainer, className)}>
      {title && <div className={styles.title}>{title}</div>}
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
