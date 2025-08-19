import classNames from 'classnames';
import React from 'react';

import CircleIcon from '@mui/icons-material/Circle';
import { PieChart } from '@mui/x-charts/PieChart';

import styles from '../styles/charts.module.css';
import type { PieChartDataItem } from 'types/dashboard.type';
import type { EngagementLevel } from 'types/statistics.type';
import { EngagementStatus } from 'types/statistics.type';

export const RED = '#D11818';
export const YELLOW = '#FFD678';
export const BLUE = '#6082FC';
export const GREEN = '#4CC64A';

const engagementLevelToPieChartItem: Record<EngagementStatus, (engagementLevel: EngagementLevel) => PieChartDataItem> = {
  [EngagementStatus.ABSENT]: (engagementLevel) => ({ value: engagementLevel.statusCount, label: 'Absentes', color: RED }),
  [EngagementStatus.GHOST]: (engagementLevel) => ({ value: engagementLevel.statusCount, label: 'Fantômes', color: YELLOW }),
  [EngagementStatus.OBSERVER]: (engagementLevel) => ({ value: engagementLevel.statusCount, label: 'Observatrices', color: BLUE }),
  [EngagementStatus.ACTIVE]: (engagementLevel) => ({ value: engagementLevel.statusCount, label: 'Actives', color: GREEN }),
};

interface Props {
  engagementLevelData: EngagementLevel[];
  className?: string;
}

const PieCharts: React.FC<Props> = ({ engagementLevelData, className }) => {
  const pieChartData: PieChartDataItem[] = formatEngagementLevelForPieChart(engagementLevelData);

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

function formatEngagementLevelForPieChart(engagementLevelData: EngagementLevel[]): PieChartDataItem[] {
  return engagementLevelData.map((engagementLevel) => engagementLevelToPieChartItem[engagementLevel.status](engagementLevel));
}
