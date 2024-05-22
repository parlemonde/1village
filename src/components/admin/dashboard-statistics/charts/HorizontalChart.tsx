import { BarChart } from '@mui/x-charts/BarChart';
import * as React from 'react';

import styles from '../styles/charts.module.css';
import { useGetClassroomExchanges, ClassroomExchangesStats } from 'src/api/statistics/statistics.get.ts';

const chartSetting = {
  xAxis: [
    {
      label: 'publications & commentaires',
    },
  ],
  width: 500,
  height: 400,
};
const dataset = [];

const valueFormatter = (value: number | null) => `${value}mm`;

// eslint-disable-next-line no-console
console.log('Data:', data);

// handle loading & errors
// if (isLoading) return <div>Loading...</div>;
// if (isError) return <div>Error...</div>;

export default function HorizontalBars() {
  return (
    <div className={styles.horizontalBars}>
      <BarChart
        dataset={dataset}
        yAxis={[
          {
            scaleType: 'band',
            dataKey: 'month',
          },
        ]}
        series={[{ dataKey: 'seoul', valueFormatter, color: '#4C3ED9' }]}
        layout="horizontal"
        {...chartSetting}
        slotProps={{
          bar: {
            clipPath: `inset(0px round 25px)`,
          },
        }}
      />
    </div>
  );
}
