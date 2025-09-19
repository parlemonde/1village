import { useEffect, useState } from 'react';

import ActivityTable from './ActivityTable';
import Loader, { AnalyticsDataType } from './Loader';
import TeamCommentCard from './TeamCommentCard';
import DashboardSummary from './dashboard-summary/DashboardSummary';
import StatisticFilters from './filters/StatisticFilters';
import DashboardWorldMap from './map/DashboardWorldMap/DashboardWorldMap';
import { mockDataByMonth } from './mocks/mocks';
import {
  useGetCountriesEngagementStatuses,
  useGetOneVillageStats,
  useGetSessionsStats,
  useGetVillageEngagementStatuses,
} from 'src/api/statistics/statistics.get';
import { useStatisticsClassrooms } from 'src/services/useStatistics';
import type { VillageInteractionsActivity } from 'types/analytics/village-interactions-activity';
import { DashboardType } from 'types/dashboard.type';
import { TeamCommentType } from 'types/teamComment.type';

const GlobalStats = () => {
  const [selectedPhase, setSelectedPhase] = useState<number>();

  const [villagesActivityData, setVillagesActivityData] = useState<VillageInteractionsActivity[]>([]);
  const [loadingActivityTableData, setLoadingActivityTableData] = useState<boolean>(true);

  const { data: sessionStatistics, isLoading: isLoadingSessionStats } = useGetSessionsStats(selectedPhase);
  const { data: classroomsStatistics, isLoading: isLoadingClassroomStatistics } = useStatisticsClassrooms(null, null, null);
  const { data: oneVillageStatistics, isLoading: isLoadingWebsiteStats } = useGetOneVillageStats();
  const { data: countriesEngagementStatuses, isLoading: isLoadingCountriesEngagementStatuses } = useGetCountriesEngagementStatuses();
  const { data: villageEngagementStatuses, isLoading: isLoadingVillageEngagementStatuses } = useGetVillageEngagementStatuses();

  useEffect(() => {
    if (villageEngagementStatuses) {
      setVillagesActivityData(villageEngagementStatuses);
      setLoadingActivityTableData(false);
    }
  }, [villageEngagementStatuses]);

  return (
    <>
      <TeamCommentCard type={TeamCommentType.GLOBAL} />
      <StatisticFilters onPhaseChange={setSelectedPhase} />
      {loadingActivityTableData || isLoadingCountriesEngagementStatuses || isLoadingVillageEngagementStatuses ? (
        <Loader analyticsDataType={AnalyticsDataType.GRAPHS} />
      ) : (
        <>
          {countriesEngagementStatuses && <DashboardWorldMap countriesEngagementStatuses={countriesEngagementStatuses} />}
          <ActivityTable activityTableData={villagesActivityData} />
        </>
      )}

      {isLoadingClassroomStatistics || isLoadingSessionStats || isLoadingWebsiteStats ? (
        <Loader analyticsDataType={AnalyticsDataType.WIDGETS} />
      ) : (
        classroomsStatistics &&
        sessionStatistics &&
        oneVillageStatistics && (
          <DashboardSummary
            dashboardType={DashboardType.ONE_VILLAGE_PANEL}
            dashboardSummaryData={{ ...classroomsStatistics, ...sessionStatistics, ...oneVillageStatistics, barChartData: mockDataByMonth }}
          />
        )
      )}
    </>
  );
};

export default GlobalStats;
