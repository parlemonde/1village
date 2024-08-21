import * as React from 'react';

import { BarChart } from '@mui/x-charts/BarChart';

import { mockClassroomsStats } from '../mocks/mocks';
import styles from '../styles/charts.module.css';

interface SumData {
  [key: string]: string | number | null;
  country: string;
  total: number;
}

const sumData: { [country: string]: SumData } = {};

mockClassroomsStats.forEach((country) => {
  const { classroomCountryCode, commentsCount, activitiesCount } = country;

  if (!sumData[classroomCountryCode]) {
    sumData[classroomCountryCode] = {
      country: classroomCountryCode,
      total: 0,
    };
  }

  sumData[classroomCountryCode].total += commentsCount;

  activitiesCount.forEach((phase) => {
    phase.activities.forEach((activity) => {
      sumData[classroomCountryCode].total += activity.count;
    });
  });
});

const dataset: SumData[] = Object.values(sumData);

const chartSetting = {
  xAxis: [
    {
      label: 'Publications et commentaires',
    },
  ],
  width: 500,
  height: 400,
};

const valueFormatter = (value: number | null) => `${value}`;

export default function HorizontalBars() {
  return (
    <div className={styles.horizontalBars}>
      <BarChart
        dataset={dataset}
        yAxis={[{ scaleType: 'band', dataKey: 'country' }]}
        series={[{ dataKey: 'total', valueFormatter, color: '#DAD7FE' }]}
        layout="horizontal"
        slotProps={{
          bar: {
            clipPath: 'inset(0px round 10px)',
          },
        }}
        {...chartSetting}
      />
      <div className={styles.customLegend}>Publications et commentaires</div>
    </div>
  );
}
