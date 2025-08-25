import classNames from 'classnames';
import React from 'react';

import CircleIcon from '@mui/icons-material/Circle';
import { PieChart } from '@mui/x-charts/PieChart';

import styles from '../styles/charts.module.css';
import type { PieChartDataItem } from 'types/dashboard.type';
import type { EngagementStatusData } from 'types/statistics.type';
import { EngagementStatus } from 'types/statistics.type';

export const RED = '#D11818';
export const YELLOW = '#FFD678';
export const BLUE = '#6082FC';
export const GREEN = '#4CC64A';

const engagementStatusToPieChartItem: Record<EngagementStatus, (engagementStatus: EngagementStatusData) => PieChartDataItem> = {
  [EngagementStatus.ABSENT]: (engagementStatus) => ({ value: engagementStatus.statusCount, label: 'Absentes', color: RED }),
  [EngagementStatus.GHOST]: (engagementStatus) => ({ value: engagementStatus.statusCount, label: 'Fantômes', color: YELLOW }),
  [EngagementStatus.OBSERVER]: (engagementStatus) => ({ value: engagementStatus.statusCount, label: 'Observatrices', color: BLUE }),
  [EngagementStatus.ACTIVE]: (engagementStatus) => ({ value: engagementStatus.statusCount, label: 'Actives', color: GREEN }),
};

interface Props {
  engagementStatusData: EngagementStatusData[];
  className?: string;
}

const PieCharts: React.FC<Props> = ({ engagementStatusData, className }) => {
  const pieChartData: PieChartDataItem[] = formatEngagementStatusForPieChart(engagementStatusData);

  return (
    <div className={classNames(styles.pieContainer, className)}>
      <div className={styles.title}>{"Niveau d'engagement"}</div>
      <PieChart
        colors={[RED, YELLOW, BLUE, GREEN]}
        series={[{ data: pieChartData }]}
        width={300}
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

function formatEngagementStatusForPieChart(engagementStatusData: EngagementStatusData[]): PieChartDataItem[] {
  return engagementStatusData.map((engagementStatus) => engagementStatusToPieChartItem[engagementStatus.status](engagementStatus));
}
