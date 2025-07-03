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
  const classroomStatistics = useStatisticsClassrooms(null, null, null) as ClassroomsStats;

  const { data: sessionStatistics } = useGetSessionsStats(selectedPhase);
  const { data: oneVillageStatistics } = useGetOneVillageStats();

  return (
    <>
      <StatisticFilters onPhaseChange={setSelectedPhase} />
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
