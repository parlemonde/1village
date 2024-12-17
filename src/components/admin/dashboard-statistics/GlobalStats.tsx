import React, { useEffect, useState } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Tab, Tabs } from '@mui/material';

import { OneVillageTable } from '../OneVillageTable';
import TabPanel from './TabPanel';
import TeamComments from './TeamComments';
import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import ClassesContributionCard from './cards/ClassesContributionCard/ClassesContributionCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from './cards/StatsCard/StatsCard';
import BarCharts from './charts/BarCharts';
import DashboardWorldMap from './map/DashboardWorldMap/DashboardWorldMap';
import PhaseDetails from './menu/PhaseDetails';
import { mockDataByMonth } from './mocks/mocks';
import styles from './styles/charts.module.css';
import { createFamiliesWithoutAccountRows, createFloatingAccountsRows } from './utils/tableCreator';
import { FamiliesWithoutAccountHeaders, FloatingAccountsHeaders } from './utils/tableHeader';
import { useGetOneVillageStats } from 'src/api/statistics/statistics.get';
import { useStatisticsClassrooms, useStatisticsSessions } from 'src/services/useStatistics';
import type { ClassroomsStats, OneVillageTableRow, SessionsStats } from 'types/statistics.type';

const BarChartTitle = 'Evolution des connexions';

const GlobalStats = () => {
  const [value, setValue] = useState(0);
  // const [selectedPhase, setSelectedPhase] = useState<number>(0);
  const oneVillageStats = useGetOneVillageStats();
  const [familiesWithoutAccountRows, setFamiliesWithoutAccountRows] = React.useState<Array<OneVillageTableRow>>([]);
  const [floatingAccountsRows, setFloatingAccountsRows] = React.useState<Array<OneVillageTableRow>>([]);
  const statisticsClassrooms = useStatisticsClassrooms(null, 'FR', null) as ClassroomsStats;

  const statisticsSessions: SessionsStats | Record<string, never> = useStatisticsSessions(null, null, null);

  useEffect(() => {
    if (oneVillageStats.data?.familiesWithoutAccount) {
      setFamiliesWithoutAccountRows([]);
      setFamiliesWithoutAccountRows(createFamiliesWithoutAccountRows(oneVillageStats.data?.familiesWithoutAccount));
    }
    if (oneVillageStats.data?.floatingAccounts) {
      setFloatingAccountsRows([]);
      setFloatingAccountsRows(createFloatingAccountsRows(oneVillageStats.data?.floatingAccounts));
    }
  }, [oneVillageStats.data?.familiesWithoutAccount, oneVillageStats.data?.floatingAccounts]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // const handlePhaseChange = (phase: string) => {
  //   setSelectedPhase(+phase);
  // };

  return (
    <>
      {/* <div className={styles.filtersContainer}>
        <div className={styles.smallFilter}>
          <PhaseDropdown onPhaseChange={handlePhaseChange} />
        </div>
        <div className={styles.medFilter} />
        <div className={styles.medFilter} />
        <div className={styles.medFilter} />
      </div> */}
      <TeamComments />
      <DashboardWorldMap />
      <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" sx={{ py: 3 }}>
        <Tab label="En classe" />
        <Tab label="En famille" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <div className="statistic--container">
          <StatsCard data={statisticsSessions.registeredClassroomsCount ? statisticsSessions.registeredClassroomsCount : 0}>
            Nombre de classes inscrites
          </StatsCard>
          <StatsCard data={statisticsSessions.connectedClassroomsCount ? statisticsSessions.connectedClassroomsCount : 0}>
            Nombre de classes connectées
          </StatsCard>
          <StatsCard data={statisticsSessions.contribuedClassroomsCount ? statisticsSessions.contribuedClassroomsCount : 0}>
            Nombre de classes contributrices
          </StatsCard>
        </div>
        <div className="statistic__average--container">
          <AverageStatsCard
            data={{
              min: statisticsSessions.minDuration ? Math.floor(statisticsSessions.minDuration / 60) : 0,
              max: statisticsSessions.maxDuration ? Math.floor(statisticsSessions.maxDuration / 60) : 0,
              average: statisticsSessions.averageDuration ? Math.floor(statisticsSessions.averageDuration / 60) : 0,
              median: statisticsSessions.medianDuration ? Math.floor(statisticsSessions.medianDuration / 60) : 0,
            }}
            unit="min"
            icon={<AccessTimeIcon sx={{ fontSize: 'inherit' }} />}
          >
            Temps de connexion moyen par classe
          </AverageStatsCard>
          <AverageStatsCard
            data={{
              min: statisticsSessions.minConnections ? statisticsSessions.minConnections : 0,
              max: statisticsSessions.maxConnections ? statisticsSessions.maxConnections : 0,
              average: statisticsSessions.averageConnections ? statisticsSessions.averageConnections : 0,
              median: statisticsSessions.medianConnections ? statisticsSessions.medianConnections : 0,
            }}
            icon={<VisibilityIcon sx={{ fontSize: 'inherit' }} />}
          >
            Nombre de connexions moyen par classe
          </AverageStatsCard>
        </div>
        <div className="statistic--container">
          <BarCharts dataByMonth={mockDataByMonth} title={BarChartTitle} />
        </div>
        <div className="statistic__average--container">
          <ClassesExchangesCard totalPublications={100} totalComments={100} totalVideos={100} />
          <ClassesContributionCard></ClassesContributionCard>
        </div>
        {statisticsClassrooms && statisticsClassrooms.phases && (
          <div className="statistic__phase--container">
            <div>
              <PhaseDetails phase={1} data={statisticsClassrooms.phases[0].data} />
            </div>
            <div className="statistic__phase">
              <PhaseDetails phase={2} data={statisticsClassrooms.phases[1].data} />
            </div>
            <div className="statistic__phase">
              <PhaseDetails phase={3} data={statisticsClassrooms.phases[1].data} />
            </div>
          </div>
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <>
          <OneVillageTable
            admin={false}
            emptyPlaceholder={<p>{'Pas de données'}</p>}
            data={familiesWithoutAccountRows}
            columns={FamiliesWithoutAccountHeaders}
            titleContent={`À surveiller : comptes non créés (${familiesWithoutAccountRows.length})`}
          />
          <OneVillageTable
            admin={false}
            emptyPlaceholder={<p>{'Pas de données'}</p>}
            data={floatingAccountsRows}
            columns={FloatingAccountsHeaders}
            titleContent={`À surveiller : comptes flottants (${floatingAccountsRows.length})`}
          />
          <Box
            className={styles.classroomStats}
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                md: 'row',
              },
              gap: 2,
            }}
          >
            <StatsCard data={oneVillageStats.data?.familyAccountsCount}>Nombre de profs ayant créé des comptes famille</StatsCard>
            <StatsCard data={oneVillageStats.data?.childrenCodesCount}>Nombre de codes enfant créés</StatsCard>
            <StatsCard data={oneVillageStats.data?.connectedFamiliesCount}>Nombre de familles connectées</StatsCard>
          </Box>
        </>
      </TabPanel>
    </>
  );
};

export default GlobalStats;
