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
import { mockDataByMonth } from './mocks/mocks';
import { getVillageActivityTableHeaders } from './utils/tableHeaders';
import type { ComparePhaseDetail } from 'src/api/statistics/compare.api';
import { useGetSessionsStats, useGetOneVillageStats, useGetCountriesEngagementStatuses } from 'src/api/statistics/statistics.get';
import { useStatisticsClassrooms } from 'src/services/useStatistics';
import type { VillageInteractionsActivity } from 'types/analytics/village-interactions-activity';
import { DashboardType, DashboardSummaryTab } from 'types/dashboard.type';
import { EngagementStatus } from 'types/statistics.type';
import { TeamCommentType } from 'types/teamComment.type';

interface VillageDetail {
  villageName: string;
  classrooms: {
    phaseDetails: ComparePhaseDetail[];
  }[];
}

interface PhaseTableRow {
  id: string | number;
  villageName: string;
  [key: string]: string | number;
}

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

  const handleTabChange = (_event: React.SyntheticEvent, selectedTab: number) => {
    setSelectedTab(selectedTab);
  };

  const handlePhaseToggle = (phaseId: number) => {
    setOpenPhases((prev) => ({
      ...prev,
      [phaseId]: !prev[phaseId],
    }));
  };

  const createPhaseTableData = (phaseId: number): PhaseTableRow[] => {
    if (!oneVillageStatistics?.activityCountDetails) return [];

    const villages: PhaseTableRow[] = [];

    const totals: Record<string, string | number> = {
      villageName: 'Total',
    };

    oneVillageStatistics.activityCountDetails.forEach((villageDetail: VillageDetail) => {
      const villageRow: PhaseTableRow = {
        id: villageDetail.villageName,
        villageName: villageDetail.villageName,
      };

      villageDetail.classrooms.forEach((classroom) => {
        classroom.phaseDetails.forEach((phase) => {
          if (phase.phaseId === phaseId) {
            const columns = getVillageActivityTableHeaders(phaseId);
            // slice(1) skips the first column ('villageName') since it's not a numeric value to sum
            columns.slice(1).forEach((column) => {
              const key = column.key as keyof typeof phase;
              const value = phase[key] || 0;
              villageRow[column.key] = ((villageRow[column.key] as number) || 0) + value;

              totals[column.key] = ((totals[column.key] as number) || 0) + value;
            });
          }
        });
      });

      villages.push(villageRow);
    });

    const totalRow: PhaseTableRow = {
      id: 'total',
      villageName: 'Total',
      ...totals,
    };

    return [totalRow, ...villages];
  };

  const rowStyle = (row: PhaseTableRow) => {
    if (row.villageName === 'Total') {
      return { color: 'black', fontWeight: 'bold', borderBottom: '2px solid black' };
    }
    return {};
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
              {/* Original DashboardSummary with charts and data */}
              {sessionStatistics && oneVillageStatistics && (
                <DashboardSummary
                  dashboardType={DashboardType.ONE_VILLAGE_PANEL}
                  dashboardSummaryData={{ ...classroomsStatistics, ...sessionStatistics, ...oneVillageStatistics, barChartData: mockDataByMonth }}
                />
              )}
              <Box mt={4}>
                {selectedPhase ? (
                  <OneVillagePhaseAccordion
                    phaseId={+selectedPhase}
                    open={openPhases[selectedPhase]}
                    onClick={() => handlePhaseToggle(selectedPhase)}
                    data={createPhaseTableData(selectedPhase)}
                    columns={getVillageActivityTableHeaders(selectedPhase)}
                    rowStyle={rowStyle}
                  />
                ) : (
                  [1, 2, 3].map((phase) => (
                    <OneVillagePhaseAccordion
                      key={phase}
                      phaseId={phase}
                      open={openPhases[phase]}
                      onClick={() => handlePhaseToggle(phase)}
                      data={createPhaseTableData(phase)}
                      columns={getVillageActivityTableHeaders(phase)}
                      rowStyle={rowStyle}
                    />
                  ))
                )}
              </Box>
            </TabPanel>

            <TabPanel value={selectedTab} index={1}>
              {/* EN FAMILLE tab - keep original content */}
              {sessionStatistics && oneVillageStatistics && (
                <DashboardSummary
                  dashboardType={DashboardType.ONE_VILLAGE_PANEL}
                  dashboardSummaryData={{ ...classroomsStatistics, ...sessionStatistics, ...oneVillageStatistics, barChartData: mockDataByMonth }}
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
