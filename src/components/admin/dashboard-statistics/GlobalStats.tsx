import React, { useState } from 'react';

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
import ActivityTable from './ActivityTable';

const GlobalStats = () => {
  const [selectedPhase, setSelectedPhase] = useState<number>(0);
  const statisticsClassrooms = useStatisticsClassrooms(null, null, null) as ClassroomsStats;

  const statisticsSessions = useGetSessionsStats(selectedPhase);
  const statisticsFamily = useGetOneVillageStats();

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
      {statisticsSessions.data && statisticsFamily.data ? (
        <DashboardSummary
          dashboardType={DashboardType.ONE_VILLAGE_PANEL}
          data={{ ...statisticsClassrooms, ...statisticsSessions.data, ...statisticsFamily.data, barChartData: mockDataByMonth }}
        />
      ) : null}
    </>
  );
};

export default GlobalStats;
