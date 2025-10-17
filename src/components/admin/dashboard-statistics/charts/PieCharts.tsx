import classNames from 'classnames';
import React from 'react';

import CircleIcon from '@mui/icons-material/Circle';
import { PieChart } from '@mui/x-charts/PieChart';

import styles from '../styles/charts.module.css';
import type { PieChartDataItem } from 'types/dashboard.type';
import type { EngagementStatusData } from 'types/statistics.type';
import { EngagementStatusColor, EngagementStatus } from 'types/statistics.type';

const engagementStatusToPieChartItem: Record<EngagementStatus, (engagementStatus: EngagementStatusData) => PieChartDataItem> = {
  [EngagementStatus.GHOST]: (engagementStatus) => ({ value: engagementStatus.statusCount, label: 'Fantômes', color: EngagementStatusColor.GHOST }),
  [EngagementStatus.OBSERVER]: (engagementStatus) => ({
    value: engagementStatus.statusCount,
    label: 'Observatrices',
    color: EngagementStatusColor.OBSERVER,
  }),
  [EngagementStatus.ACTIVE]: (engagementStatus) => ({ value: engagementStatus.statusCount, label: 'Actives', color: EngagementStatusColor.ACTIVE }),
};

interface Props {
  engagementStatusData: EngagementStatusData[];
  className?: string;
}

const PieCharts: React.FC<Props> = ({ engagementStatusData, className }) => {
  const pieChartData: PieChartDataItem[] = formatEngagementStatusForPieChart(engagementStatusData);

  return (
    <div className={classNames(styles.pieContainer, className)}>
      <div className={styles.title} style={{ paddingBottom: '30px' }}>
        {"Niveau d'engagement"}
      </div>
      <PieChart
        colors={[EngagementStatusColor.GHOST, EngagementStatusColor.OBSERVER, EngagementStatusColor.ACTIVE]}
        series={[{ data: pieChartData }]}
        width={300}
        height={200}
        slotProps={{
          legend: { hidden: true },
        }}
        sx={{ ml: { xl: '6.5rem', lg: '6.5rem', md: '2.0rem', xs: '6.5rem' } }}
      />
      <div style={{ display: 'block', textAlign: 'center', margin: '2.5rem auto 0' }}>
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
