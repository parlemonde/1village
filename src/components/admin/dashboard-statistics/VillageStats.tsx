import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Tab, Tabs } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { TeamCommentType } from '../../../../types/teamComment.type';
import { OneVillageTable } from '../OneVillageTable';
import { getCommentCount, getPublicationCount, getVideoCount } from '../StatisticsUtils';
import CountryActivityPhaseAccordion from './CountryActivityPhaseAccordion';
import TabPanel from './TabPanel';
import TeamCommentCard from './TeamCommentCard';
import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import ClassesContributionCard from './cards/ClassesContributionCard/ClassesContributionCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from './cards/StatsCard/StatsCard';
import BarCharts from './charts/BarCharts';
import DualBarChart from './charts/DualBarChart/DualBarChart';
import PieCharts from './charts/PieCharts';
import StatisticFilters from './filters/StatisticFilters';
import PhaseDetails from './menu/PhaseDetails';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import { createFamiliesWithoutAccountRows } from './utils/tableCreator';
import { FamiliesWithoutAccountHeaders } from './utils/tableHeader';
import { useGetVillagesStats, useGetCompareStats } from 'src/api/statistics/statistics.get';
import { useStatisticsClassrooms, useStatisticsSessions } from 'src/services/useStatistics';
import type { ClassroomsStats, OneVillageTableRow, SessionsStats } from 'types/statistics.type';

const VillageStats = () => {
  const data = { data: [{ label: 'test1', id: 1, value: 1 }] };

  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPhase, setSelectedPhase] = useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [selectedVillage, setSelectedVillage] = useState<number>();
  const [familiesWithoutAccountRows, setFamiliesWithoutAccountRows] = useState<Array<OneVillageTableRow>>([]);
  const [openPhases, setOpenPhases] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
  });

  const { data: villageStatistics } = useGetVillagesStats(selectedVillage, selectedPhase);
  const statisticsClassrooms = useStatisticsClassrooms(null, selectedCountry, null) as ClassroomsStats;
  const statisticsSessions: SessionsStats | Record<string, never> = useStatisticsSessions(Number(selectedVillage), null, null, selectedPhase);
  const { data: compareData } = useGetCompareStats();

  const videoCount = getVideoCount(villageStatistics);
  const commentCount = getCommentCount(villageStatistics);
  const publicationCount = getPublicationCount(villageStatistics);

  // Extract barChartData for better readability
  const barChartData = statisticsSessions?.barChartData || [];

  useEffect(() => {
    if (villageStatistics?.family?.familiesWithoutAccount) {
      setFamiliesWithoutAccountRows(createFamiliesWithoutAccountRows(villageStatistics.family.familiesWithoutAccount));
    }
  }, [villageStatistics?.family?.familiesWithoutAccount]);

  const handleTabChange = (_event: React.SyntheticEvent, selectedTab: number) => {
    setSelectedTab(selectedTab);
  };

  const pelicoMessage = 'Merci de sélectionner un village-monde pour analyser ses statistiques';
  const noDataFoundMessage = 'Pas de données pour le Village-Monde sélectionné';

  const firstTable = {
    country: 'France',
    data: [
      { name: 'École A', value: 300 },
      { name: 'École B', value: 200 },
      { name: 'École C', value: 250 },
      { name: 'École D', value: 400 },
      { name: 'École E', value: 350 },
      { name: 'École F', value: 300 },
      { name: 'École G', value: 350 },
    ],
  };

  const secondTable = {
    country: 'Canada',
    data: [
      { name: 'École H', value: 150 },
      { name: 'École I', value: 250 },
      { name: 'École J', value: 200 },
      { name: 'École K', value: 350 },
      { name: 'École L', value: 300 },
      { name: 'École M', value: 150 },
      { name: 'École N', value: 180 },
    ],
  };

  return (
    <>
      <TeamCommentCard type={TeamCommentType.VILLAGE} />
      <StatisticFilters
        onPhaseChange={setSelectedPhase}
        onCountryChange={setSelectedCountry}
        onVillageChange={setSelectedVillage}
        selectedPhase={selectedPhase}
      />
      {selectedCountry && selectedVillage ? (
        <>
          <DualBarChart firstTable={firstTable} secondTable={secondTable} />
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="basic tabs example" sx={{ py: 3 }}>
            <Tab label="En classe" />
            <Tab label="En famille" />
          </Tabs>
          <TabPanel value={selectedTab} index={0}>
            <div className="statistic--container">
              <StatsCard data={statisticsSessions.registeredClassroomsCount ?? 0}>Nombre de classes inscrites</StatsCard>
              <StatsCard data={statisticsSessions.connectedClassroomsCount ?? 0}>Nombre de classes connectées</StatsCard>
              <StatsCard data={statisticsSessions.contributedClassroomsCount ?? 0}>Nombre de classes contributrices</StatsCard>
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
                  min: statisticsSessions.minConnections ?? 0,
                  max: statisticsSessions.maxConnections ?? 0,
                  average: statisticsSessions.averageConnections ?? 0,
                  median: statisticsSessions.medianConnections ?? 0,
                }}
                icon={<VisibilityIcon sx={{ fontSize: 'inherit' }} />}
              >
                Nombre de connexions moyen par classe
              </AverageStatsCard>
            </div>
            <div className="statistic__average--container">
              <PieCharts pieChartData={data} />
              <BarCharts dataByMonth={barChartData} title="Évolution des connexions" />
            </div>
            <div className="statistic__average--container">
              <ClassesExchangesCard totalPublications={publicationCount} totalComments={commentCount} totalVideos={videoCount} />
              <ClassesContributionCard />
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
            {selectedVillage &&
              selectedPhase !== undefined &&
              compareData &&
              (selectedPhase === 0 ? (
                [1, 2, 3].map((phase) => (
                  <CountryActivityPhaseAccordion
                    key={phase}
                    phaseId={phase}
                    villageId={+selectedVillage}
                    open={openPhases[phase]}
                    onClick={() =>
                      setOpenPhases((prev) => ({
                        ...prev,
                        [phase]: !prev[phase],
                      }))
                    }
                  />
                ))
              ) : (
                <CountryActivityPhaseAccordion
                  phaseId={+selectedPhase}
                  villageId={+selectedVillage}
                  open={openPhases[selectedPhase]}
                  onClick={() =>
                    setOpenPhases((prev) => ({
                      ...prev,
                      [selectedPhase]: !prev[selectedPhase],
                    }))
                  }
                />
              ))}
          </TabPanel>
          <TabPanel value={selectedTab} index={1}>
            <OneVillageTable
              admin={false}
              emptyPlaceholder={<p>{noDataFoundMessage}</p>}
              data={familiesWithoutAccountRows}
              columns={FamiliesWithoutAccountHeaders}
              titleContent={`À surveiller : comptes non créés (${familiesWithoutAccountRows.length})`}
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
              <StatsCard data={villageStatistics?.family?.familyAccountsCount}>Nombre de profs ayant créé des comptes famille</StatsCard>
              <StatsCard data={villageStatistics?.family?.childrenCodesCount}>Nombre de codes enfant créés</StatsCard>
              <StatsCard data={villageStatistics?.family?.connectedFamiliesCount}>Nombre de familles connectées</StatsCard>
            </Box>

            {/* Phase tables for Familles tab */}
            {selectedVillage &&
              selectedPhase !== undefined &&
              compareData &&
              (selectedPhase === 0 ? (
                [1, 2, 3].map((phase) => (
                  <CountryActivityPhaseAccordion
                    key={phase}
                    phaseId={phase}
                    villageId={+selectedVillage}
                    open={openPhases[phase]}
                    onClick={() =>
                      setOpenPhases((prev) => ({
                        ...prev,
                        [phase]: !prev[phase],
                      }))
                    }
                  />
                ))
              ) : (
                <CountryActivityPhaseAccordion
                  phaseId={+selectedPhase}
                  villageId={+selectedVillage}
                  open={openPhases[selectedPhase]}
                  onClick={() =>
                    setOpenPhases((prev) => ({
                      ...prev,
                      [selectedPhase]: !prev[selectedPhase],
                    }))
                  }
                />
              ))}
          </TabPanel>
        </>
      ) : (
        <PelicoCard message={pelicoMessage} />
      )}
    </>
  );
};

export default VillageStats;
