import classNames from 'classnames';
import React from 'react';

import CircleIcon from '@mui/icons-material/Circle';
import { PieChart } from '@mui/x-charts/PieChart';

import styles from '../styles/charts.module.css';
import type { PieChartDataItem } from 'types/dashboard.type';

const RED = '#D11818';
const YELLOW = '#FFD678';
const BLUE = '#6082FC';
const GREEN = '#4CC64A';

interface Props {
  pieChartData: PieChartDataItem[];
  className?: string;
}

const PieCharts: React.FC<Props> = ({ pieChartData, className }) => {
  return (
    <div className={classNames(styles.pieContainer, className)}>
      <div className={styles.title}>{"Niveau d'engagement"}</div>
      <PieChart
        colors={[RED, YELLOW, BLUE, GREEN]}
        series={[{ data: pieChartData }]}
        width={400}
        height={200}
        slotProps={{
          legend: { hidden: true },
        }}
        sx={{ marginLeft: '6.5rem' }}
      />
      <div style={{ display: 'block', maxWidth: '215px', margin: '.5rem auto 0' }}>
        {pieChartData.map((engagementData) => (
          <div key={engagementData.label} className={styles.legendItem}>
            <CircleIcon sx={{ color: engagementData.color, verticalAlign: 'middle', height: '.90rem' }} />
            <span>{engagementData.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PieCharts;
