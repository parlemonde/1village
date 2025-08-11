import { useEffect, useState } from 'react';

import ActivityTable from './ActivityTable';
import Loader, { AnalyticsDataType } from './Loader';
import TeamCommentCard from './TeamCommentCard';
import DashboardSummary from './dashboard-summary/DashboardSummary';
import StatisticFilters from './filters/StatisticFilters';
import DashboardWorldMap from './map/DashboardWorldMap/DashboardWorldMap';
import { mockDataByMonth } from './mocks/mocks';
import { useGetOneVillageStats, useGetSessionsStats } from 'src/api/statistics/statistics.get';
import { useStatisticsClassrooms } from 'src/services/useStatistics';
import type { VillageInteractionsActivity } from 'types/analytics/village-interactions-activity';
import { VillageInteractionsStatus } from 'types/analytics/village-interactions-activity';
import { DashboardType } from 'types/dashboard.type';
import type { ClassroomsStats } from 'types/statistics.type';
import { TeamCommentType } from 'types/teamComment.type';

const GlobalStats = () => {
  const [selectedPhase, setSelectedPhase] = useState<number>();
  const classroomStatistics = useStatisticsClassrooms(null, null, null) as ClassroomsStats;

  const [mapData, setMapData] = useState<VillageInteractionsActivity[]>([]);
  const [loadingMapData, setLoadingMapData] = useState<boolean>(true);

  const { data: sessionStatistics, isLoading: isLoadingSessionStats } = useGetSessionsStats(selectedPhase);
  const { data: oneVillageStatistics, isLoading: isLoadingWebsiteStats } = useGetOneVillageStats();

  // On mocke l'asynchronisme en attendant d'avoir l'appel serveur censé retourner les interactions des villages-mondes
  // A refacto lors de l'implémentation du ticket VIL-10: Planisphère représentant l'activité d'1V
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
          status: VillageInteractionsStatus.ACTIVE,
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
          status: VillageInteractionsStatus.OBSERVER,
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
          status: VillageInteractionsStatus.GHOST,
        },
      ];

      setMapData(fakeAnalyticsData);
      setLoadingMapData(false);
    }, 2000);
  }, []);

  return (
    <>
      <TeamCommentCard type={TeamCommentType.GLOBAL} />
      <StatisticFilters onPhaseChange={setSelectedPhase} />
      {loadingMapData ? (
        <Loader analyticsDataType={AnalyticsDataType.GRAPHS} />
      ) : (
        <>
          <DashboardWorldMap />
          <ActivityTable activityTableData={mapData} />
        </>
      )}
      {isLoadingSessionStats || isLoadingWebsiteStats ? (
        <Loader analyticsDataType={AnalyticsDataType.WIDGETS} />
      ) : (
        sessionStatistics &&
        oneVillageStatistics && (
          <DashboardSummary
            dashboardType={DashboardType.ONE_VILLAGE_PANEL}
            data={{ ...classroomStatistics, ...sessionStatistics, ...oneVillageStatistics, barChartData: mockDataByMonth }}
          />
        )
      )}
    </>
  );
};

export default GlobalStats;
