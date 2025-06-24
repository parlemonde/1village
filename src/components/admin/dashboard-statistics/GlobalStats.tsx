import React, { useState } from 'react';

import ActivityTable from './ActivityTable';
import TeamComments from './TeamComments';
import DashboardSummary from './dashboard-summary/DashboardSummary';
import StatisticFilters from './filters/StatisticFilters';
import DashboardWorldMap from './map/DashboardWorldMap/DashboardWorldMap';
import { mockDataByMonth } from './mocks/mocks';
import { useGetOneVillageStats, useGetSessionsStats } from 'src/api/statistics/statistics.get';
import { useStatisticsClassrooms } from 'src/services/useStatistics';
import { DashboardType } from 'types/dashboard.type';
import type { ClassroomsStats } from 'types/statistics.type';

const GlobalStats = () => {
  const [selectedPhase, setSelectedPhase] = useState<number>();
  const statisticsClassrooms = useStatisticsClassrooms(null, null, null) as ClassroomsStats;

  const statisticsSessions = useGetSessionsStats(selectedPhase);
  const statisticsFamily = useGetOneVillageStats();

  return (
    <>
      <StatisticFilters onPhaseChange={setSelectedPhase} />
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
