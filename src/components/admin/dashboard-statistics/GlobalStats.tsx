import React, { useState } from 'react';

import ActivityTable from './ActivityTable';
import TeamComments from './TeamComments';
import DashboardSummary from './dashboard-summary/DashboardSummary';
import PhaseDropdown from './filters/PhaseDropdown';
import DashboardWorldMap from './map/DashboardWorldMap/DashboardWorldMap';
import { mockDataByMonth } from './mocks/mocks';
import styles from './styles/charts.module.css';
import { useGetOneVillageStats, useGetSessionsStats } from 'src/api/statistics/statistics.get';
import { useStatisticsClassrooms } from 'src/services/useStatistics';
import { DashboardType } from 'types/dashboard.type';
import type { ClassroomsStats } from 'types/statistics.type';

const GlobalStats = () => {
  const [selectedPhase, setSelectedPhase] = useState<number>(0);
  const classroomStatistics = useStatisticsClassrooms(null, null, null) as ClassroomsStats;

  const { data: sessionStatistics } = useGetSessionsStats(selectedPhase);
  const { data: oneVillageStatistics } = useGetOneVillageStats();

  const handlePhaseChange = (phase: string) => {
    setSelectedPhase(+phase);
  };

  return (
    <>
      <div className={styles.filtersContainer}>
        <div className={styles.smallFilter}>
          <PhaseDropdown onPhaseChange={handlePhaseChange} />
        </div>
        <div className={styles.medFilter} />
        <div className={styles.medFilter} />
        <div className={styles.medFilter} />
      </div>
      <TeamComments />
      <DashboardWorldMap />
      <ActivityTable />
      {sessionStatistics && oneVillageStatistics && (
        <DashboardSummary
          dashboardType={DashboardType.ONE_VILLAGE_PANEL}
          data={{ ...classroomStatistics, ...sessionStatistics, ...oneVillageStatistics, barChartData: mockDataByMonth }}
        />
      )}
    </>
  );
};

export default GlobalStats;
