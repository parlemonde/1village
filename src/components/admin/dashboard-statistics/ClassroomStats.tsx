import React, { useEffect, useState } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Tab, Tabs } from '@mui/material';

import { OneVillageTable } from '../OneVillageTable';
import { getCommentCount, getPublicationCount, getVideoCount } from '../StatisticsUtils';
import TabPanel from './TabPanel';
import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import ClassroomDetailsCard from './cards/ClassroomDetailsCard/ClassroomDetailsCard';
import CommentCard from './cards/CommentCard/CommentCard';
import StatsCard from './cards/StatsCard/StatsCard';
import BarCharts from './charts/BarCharts';
import StatisticFilters from './filters/StatisticFilters';
import PhaseDetails from './menu/PhaseDetails';
import { mockDataByMonth } from './mocks/mocks';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import { createFamiliesWithoutAccountRows } from './utils/tableCreator';
import { FamiliesWithoutAccountHeaders } from './utils/tableHeader';
import { useGetClassroomsStats } from 'src/api/statistics/statistics.get';
import { useStatisticsClassrooms, useStatisticsSessions } from 'src/services/useStatistics';
import type { ClassroomsStats, OneVillageTableRow, SessionsStats } from 'types/statistics.type';

const BarChartTitle = 'Evolution des connexions';

const ClassroomStats = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [selectedVillage, setSelectedVillage] = useState<number>();
  const [selectedClassroom, setSelectedClassroom] = useState<number>();
  const [familiesWithoutAccountRows, setFamiliesWithoutAccountRows] = useState<Array<OneVillageTableRow>>([]);

  const statisticsSessions: SessionsStats | Record<string, never> = useStatisticsSessions(null, null, 1);
  const statisticsClassrooms = useStatisticsClassrooms(null, selectedCountry, null) as ClassroomsStats;
  const { data: classroomStatistics } = useGetClassroomsStats(selectedClassroom, selectedPhase);

  const pelicoMessage = 'Merci de sélectionner une classe pour analyser ses statistiques ';
  const noDataFoundMessage = 'Pas de données pour la classe sélectionnée';

  useEffect(() => {
    if (classroomStatistics?.family?.familiesWithoutAccount) {
      setFamiliesWithoutAccountRows(createFamiliesWithoutAccountRows(classroomStatistics.family.familiesWithoutAccount));
    }
  }, [classroomStatistics?.family?.familiesWithoutAccount]);

  const videoCount = getVideoCount(classroomStatistics);
  const commentCount = getCommentCount(classroomStatistics);
  const publicationCount = getPublicationCount(classroomStatistics);

  const handleTabChange = (_event: React.SyntheticEvent, selectedTab: number) => {
    setSelectedTab(selectedTab);
  };

  return (
    <>
      <StatisticFilters
        onPhaseChange={setSelectedPhase}
        onCountryChange={setSelectedCountry}
        onVillageChange={setSelectedVillage}
        onClassroomChange={setSelectedClassroom}
      />
      {selectedCountry && selectedVillage && selectedClassroom ? (
        <Box mt={2}>
          <CommentCard />
          <ClassroomDetailsCard />
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="basic tabs example" sx={{ py: 3 }}>
            <Tab label="En classe" />
            <Tab label="En famille" />
          </Tabs>
          <TabPanel value={selectedTab} index={0}>
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
              <ClassesExchangesCard totalPublications={publicationCount} totalComments={commentCount} totalVideos={videoCount} />
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
              <StatsCard data={classroomStatistics?.family?.childrenCodesCount}>Nombre de codes enfant créés</StatsCard>
              <StatsCard data={classroomStatistics?.family?.connectedFamiliesCount}>Nombre de familles connectées</StatsCard>
            </Box>
          </TabPanel>
        </Box>
      ) : (
        <PelicoCard message={pelicoMessage} />
      )}
    </>
  );
};

export default ClassroomStats;
