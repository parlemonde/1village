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
import {
  useGetSessionsStats,
  useGetOneVillageStats,
  useGetCountriesEngagementStatuses,
  useGetVillageEngagementStatuses,
} from 'src/api/statistics/statistics.get';
import { useStatisticsClassrooms } from 'src/services/useStatistics';
import type { VillageInteractionsActivity } from 'types/analytics/village-interactions-activity';
import { DashboardType, DashboardSummaryTab } from 'types/dashboard.type';
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
  const { data: villageEngagementStatuses, isLoading: isLoadingVillageEngagementStatuses } = useGetVillageEngagementStatuses();

  useEffect(() => {
    if (villageEngagementStatuses) {
      setVillagesActivityData(villageEngagementStatuses);
      setLoadingActivityTableData(false);
    }
  }, [villageEngagementStatuses]);

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
