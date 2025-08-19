import classNames from 'classnames';
import React from 'react';

import { BarChart } from '@mui/x-charts/BarChart';

import styles from '../styles/charts.module.css';

interface Props {
  dataByStep: { total: number; data: { step: string; contributions: number }[] };
  title?: string;
  className?: string;
}

const ContributionBarChart: React.FC<Props> = ({ dataByStep, title, className }) => {
  const dataWithPercent = dataByStep.data.map((d) => ({
    ...d,
    percent: Math.round((d.contributions / dataByStep.total) * 100), // arrondi à l'entier
  }));

  return (
    <div className={classNames(styles.contributionBarContainer, className)}>
      {title && <div className={styles.verticalTitle}>{title}</div>}
      <div className={styles.contributionChart}>
        <BarChart
          sx={{
            '& .MuiChartsAxis-bottom .MuiChartsAxis-line': {
              strokeWidth: 0,
            },
            '& .MuiChartsAxis-left .MuiChartsAxis-line': {
              strokeWidth: 0,
            },
          }}
          xAxis={[
            {
              scaleType: 'band',
              data: dataWithPercent.map((data) => data.step),
              tickSize: 0,
            },
          ]}
          yAxis={[
            {
              tickSize: 0,
              valueFormatter: (value) => `${value}%`, // <-- Ajout ici
              min: 0,
              max: 100,
            },
          ]}
          series={[
            {
              data: dataWithPercent.map((data) => data.percent),
              valueFormatter: (value) => `${value}%`,
            },
          ]}
          slotProps={{
            bar: {
              clipPath: `inset(0px round 40px)`,
            },
          }}
        />
      </div>
    </div>
  );
};

export default ContributionBarChart;
