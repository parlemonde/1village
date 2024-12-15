import React from 'react';

import { BarChart } from '@mui/x-charts/BarChart';

import styles from '../styles/charts.module.css';
import { sumAllData } from '../utils/sumData';

const chartSetting = {
  width: 500,
  height: 400,
};

const valueFormatter = (value: number | null) => `${value}`;

export default function HorizontalBars() {
  return (
    <div className={styles.horizontalBars}>
      <BarChart
        dataset={sumAllData}
        yAxis={[{ scaleType: 'band', dataKey: 'country' }]}
        series={[
          {
            dataKey: 'total',
            valueFormatter,
            color: '#DAD7FE', // if country selected with filer : #4C3ED9
          },
        ]}
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
