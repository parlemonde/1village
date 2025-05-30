import { useState, useEffect } from 'react';

import { Box, Tabs, Tab } from '@mui/material';

import ActivityTable from './ActivityTable';
import Loader, { AnalyticsDataType } from './Loader';
import OneVillagePhaseAccordion from './OneVillagePhaseAccordion';
import TabPanel from './TabPanel';
import TeamCommentCard from './TeamCommentCard';
import DashboardSummary from './dashboard-summary/DashboardSummary';
import StatisticFilters from './filters/StatisticFilters';
import DashboardWorldMap from './map/DashboardWorldMap/DashboardWorldMap';
import { useGetSessionsStats, useGetOneVillageStats, useGetCountriesEngagementStatuses } from 'src/api/statistics/statistics.get';
import { useStatisticsClassrooms } from 'src/services/useStatistics';
import type { VillageInteractionsActivity } from 'types/analytics/village-interactions-activity';
import { DashboardType, DashboardSummaryTab } from 'types/dashboard.type';
import { EngagementStatus } from 'types/statistics.type';
import { TeamCommentType } from 'types/teamComment.type';

const GlobalStats = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPhase, setSelectedPhase] = useState<number>();
  const [openPhases, setOpenPhases] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
  });

  const [villagesActivityData, setVillagesActivityData] = useState<VillageInteractionsActivity[]>([]);
  const [loadingActivityTableData, setLoadingActivityTableData] = useState<boolean>(true);

  const { data: sessionStatistics, isLoading: isLoadingSessionStats } = useGetSessionsStats(selectedPhase);
  const { data: classroomsStatistics, isLoading: isLoadingClassroomStatistics } = useStatisticsClassrooms(null, null, null);
  const { data: oneVillageStatistics, isLoading: isLoadingWebsiteStats } = useGetOneVillageStats(selectedPhase);
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

  const handleTabChange = (_event: React.SyntheticEvent, selectedTab: number) => {
    setSelectedTab(selectedTab);
  };

  const handlePhaseToggle = (phaseId: number) => {
    setOpenPhases((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId],
    }));
  };

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
        oneVillageStatistics && (
          <Box mt={2}>
            <Tabs value={selectedTab} onChange={handleTabChange} aria-label="basic tabs example" sx={{ py: 3 }}>
              <Tab label="En classe" />
              <Tab label="En famille" />
            </Tabs>

            <TabPanel value={selectedTab} index={0}>
              {sessionStatistics && oneVillageStatistics && (
                <DashboardSummary
                  dashboardType={DashboardType.ONE_VILLAGE_PANEL}
                  dashboardSummaryData={{ ...classroomsStatistics, ...sessionStatistics, ...oneVillageStatistics }}
                />
              )}
              <Box mt={4}>
                {selectedPhase ? (
                  <OneVillagePhaseAccordion
                    phaseId={selectedPhase}
                    open={openPhases[selectedPhase]}
                    onClick={() => handlePhaseToggle(selectedPhase)}
                  />
                ) : (
                  [1, 2, 3].map((phase) => (
                    <OneVillagePhaseAccordion key={phase} phaseId={phase} open={openPhases[phase]} onClick={() => handlePhaseToggle(phase)} />
                  ))
                )}
              </Box>
            </TabPanel>

            <TabPanel value={selectedTab} index={1}>
              {sessionStatistics && oneVillageStatistics && (
                <DashboardSummary
                  dashboardType={DashboardType.ONE_VILLAGE_PANEL}
                  dashboardSummaryData={{ ...classroomsStatistics, ...sessionStatistics, ...oneVillageStatistics }}
                  activeTab={DashboardSummaryTab.FAMILY}
                />
              )}
            </TabPanel>
          </Box>
        )
      )}
    </>
  );
};

export default GlobalStats;
