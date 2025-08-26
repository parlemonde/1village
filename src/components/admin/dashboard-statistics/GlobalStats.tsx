import { useEffect, useState } from 'react';

import ActivityTable from './ActivityTable';
import Loader, { AnalyticsDataType } from './Loader';
import TeamCommentCard from './TeamCommentCard';
import DashboardSummary from './dashboard-summary/DashboardSummary';
import StatisticFilters from './filters/StatisticFilters';
import DashboardWorldMap from './map/DashboardWorldMap/DashboardWorldMap';
import { mockDataByMonth } from './mocks/mocks';
import { useGetCountriesEngagementStatuses, useGetOneVillageStats, useGetSessionsStats } from 'src/api/statistics/statistics.get';
import { useStatisticsClassrooms } from 'src/services/useStatistics';
import type { VillageInteractionsActivity } from 'types/analytics/village-interactions-activity';
import { DashboardType } from 'types/dashboard.type';
import { EngagementStatus } from 'types/statistics.type';
import { TeamCommentType } from 'types/teamComment.type';

const GlobalStats = () => {
  const [selectedPhase, setSelectedPhase] = useState<number>();

  const [villagesActivityData, setVillagesActivityData] = useState<VillageInteractionsActivity[]>([]);
  const [loadingActivityTableData, setLoadingActivityTableData] = useState<boolean>(true);

  const { data: sessionStatistics, isLoading: isLoadingSessionStats } = useGetSessionsStats(selectedPhase);
  const { data: classroomsStatistics, isLoading: isLoadingClassroomStatistics } = useStatisticsClassrooms(null, null, null);
  const { data: oneVillageStatistics, isLoading: isLoadingWebsiteStats } = useGetOneVillageStats();
  const { data: countriesEngagementStatuses, isLoading: isLoadingCountriesEngagementStatuses } = useGetCountriesEngagementStatuses();

  // On mocke l'asynchronisme en attendant d'avoir l'appel serveur censé retourner les interactions des villages-mondes
  // A refacto lors de l'implémentation du ticket pour l'implémentation du composant ActivityTable
  useEffect(() => {
    setTimeout(() => {
      const fakeAnalyticsData: VillageInteractionsActivity[] = [
        {
          id: 1,
          countries: [
            {
              isoCode: 'FR',
              name: 'France',
            },
            {
              isoCode: 'LU',
              name: 'Luxembourg',
            },
          ],
          totalConnections: 240,
          totalActivities: 853,
          status: EngagementStatus.ACTIVE,
        },
        {
          id: 2,
          countries: [
            {
              isoCode: 'FR',
              name: 'France',
            },
            {
              isoCode: 'US',
              name: 'United States',
            },
          ],
          totalConnections: 35,
          totalActivities: 140,
          status: EngagementStatus.OBSERVER,
        },
        {
          id: 3,
          countries: [
            {
              isoCode: 'FR',
              name: 'France',
            },
            {
              isoCode: 'GB',
              name: 'United Kingdom',
            },
          ],
          totalConnections: 56,
          totalActivities: 593,
          status: EngagementStatus.GHOST,
        },
      ];

      setVillagesActivityData(fakeAnalyticsData);
      setLoadingActivityTableData(false);
    }, 2000);
  }, []);

  return (
    <>
      <TeamCommentCard type={TeamCommentType.GLOBAL} />
      <StatisticFilters onPhaseChange={setSelectedPhase} />
      {loadingActivityTableData || isLoadingCountriesEngagementStatuses ? (
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
