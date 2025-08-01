import { Box, Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';

import { TeamCommentType } from '../../../../types/teamComment.type';
import ActivityTable from './ActivityTable';
import OneVillagePhaseAccordion from './OneVillagePhaseAccordion';
import TabPanel from './TabPanel';
import TeamCommentCard from './TeamCommentCard';
import DashboardSummary from './dashboard-summary/DashboardSummary';
import StatisticFilters from './filters/StatisticFilters';
import DashboardWorldMap from './map/DashboardWorldMap/DashboardWorldMap';
import { mockDataByMonth } from './mocks/mocks';
import { useGetOneVillageStats, useGetSessionsStats } from 'src/api/statistics/statistics.get';
import { useStatisticsClassrooms } from 'src/services/useStatistics';
import { DashboardType, DashboardSummaryTab } from 'types/dashboard.type';
import type { ClassroomsStats } from 'types/statistics.type';

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
  const classroomStatistics = useStatisticsClassrooms(null, null, null) as ClassroomsStats;

  const { data: sessionStatistics } = useGetSessionsStats(selectedPhase);
  const { data: oneVillageStatistics } = useGetOneVillageStats();

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

    // Calculate totals
    const totals: Record<string, number> = {
      villageName: 'Total' as unknown as number,
    };

    oneVillageStatistics.activityCountDetails.forEach(
      (villageDetail: {
        villageName: string;
        classrooms: Array<{
          phaseDetails: Array<{
            phaseId: number;
            mascotCount?: number;
            videoCount?: number;
            draftCount?: number;
            commentCount?: number;
            challengeCount?: number;
            enigmaCount?: number;
            gameCount?: number;
            questionCount?: number;
            reactionCount?: number;
            reportingCount?: number;
            storyCount?: number;
            anthemCount?: number;
            reinventStoryCount?: number;
            contentLibreCount?: number;
          }>;
        }>;
      }) => {
        const villageRow: PhaseTableRow = {
          id: villageDetail.villageName,
          villageName: villageDetail.villageName,
        };

        villageDetail.classrooms.forEach((classroom) => {
          classroom.phaseDetails.forEach((phase) => {
            if (phase.phaseId === phaseId) {
              const columns = getPhaseColumns(phaseId);
              columns.slice(1).forEach((column) => {
                const key = column.key as keyof typeof phase;
                const value = phase[key] || 0;
                villageRow[column.key] = ((villageRow[column.key] as number) || 0) + (value as number);

                if (totals[column.key] === undefined) {
                  totals[column.key] = 0;
                }
                totals[column.key] += value as number;
              });
            }
          });
        });

        villages.push(villageRow);
      },
    );

    // Add total row
    const totalRow: PhaseTableRow = {
      id: 'total',
      villageName: 'Total',
      ...totals,
    };

    return [totalRow, ...villages];
  };

  // Function to get columns based on phase
  const getPhaseColumns = (phaseId: number) => {
    const baseColumns = [{ key: 'villageName', label: 'Nom du village', sortable: true }];

    if (phaseId === 1) {
      return [
        ...baseColumns,
        { key: 'mascotCount', label: 'Mascottes', sortable: true },
        { key: 'videoCount', label: 'Vidéos', sortable: true },
        { key: 'draftCount', label: 'Brouillons', sortable: true },
        { key: 'commentCount', label: 'Commentaires', sortable: true },
      ];
    } else if (phaseId === 2) {
      return [
        ...baseColumns,
        { key: 'reportingCount', label: 'Reportages', sortable: true },
        { key: 'challengeCount', label: 'Défis', sortable: true },
        { key: 'enigmaCount', label: 'Énigmes', sortable: true },
        { key: 'gameCount', label: 'Jeux', sortable: true },
        { key: 'questionCount', label: 'Questions', sortable: true },
        { key: 'reactionCount', label: 'Réactions', sortable: true },
        { key: 'storyCount', label: 'Histoire', sortable: true },
        { key: 'videoCount', label: 'Vidéos', sortable: true },
        { key: 'commentCount', label: 'Commentaires', sortable: true },
      ];
    } else if (phaseId === 3) {
      return [
        ...baseColumns,
        { key: 'anthemCount', label: 'Hymne', sortable: true },
        { key: 'reinventStoryCount', label: 'Réécriture', sortable: true },
        { key: 'videoCount', label: 'Vidéos', sortable: true },
        { key: 'commentCount', label: 'Commentaires', sortable: true },
        { key: 'draftCount', label: 'Brouillons', sortable: true },
      ];
    }

    return baseColumns;
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
      <DashboardWorldMap />
      <ActivityTable />

      {oneVillageStatistics && (
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
                data={{ ...classroomStatistics, ...sessionStatistics, ...oneVillageStatistics, barChartData: mockDataByMonth }}
                activeTab={DashboardSummaryTab.CLASSROOM}
              />
            )}

            {/* Phase Tables - NEW ADDITION */}
            <Box mt={4}>
              {/* Phase 1 */}
              <OneVillagePhaseAccordion
                phaseId={1}
                open={openPhases[1]}
                onClick={() => handlePhaseToggle(1)}
                data={createPhaseTableData(1)}
                columns={getPhaseColumns(1)}
                rowStyle={rowStyle}
              />

              {/* Phase 2 */}
              <OneVillagePhaseAccordion
                phaseId={2}
                open={openPhases[2]}
                onClick={() => handlePhaseToggle(2)}
                data={createPhaseTableData(2)}
                columns={getPhaseColumns(2)}
                rowStyle={rowStyle}
              />

              {/* Phase 3 */}
              <OneVillagePhaseAccordion
                phaseId={3}
                open={openPhases[3]}
                onClick={() => handlePhaseToggle(3)}
                data={createPhaseTableData(3)}
                columns={getPhaseColumns(3)}
                rowStyle={rowStyle}
              />
            </Box>
          </TabPanel>

          <TabPanel value={selectedTab} index={1}>
            {/* EN FAMILLE tab - keep original content */}
            {sessionStatistics && oneVillageStatistics && (
              <DashboardSummary
                dashboardType={DashboardType.ONE_VILLAGE_PANEL}
                data={{ ...classroomStatistics, ...sessionStatistics, ...oneVillageStatistics, barChartData: mockDataByMonth }}
                activeTab={DashboardSummaryTab.FAMILY}
              />
            )}
          </TabPanel>
        </Box>
      )}
    </>
  );
};

export default GlobalStats;
