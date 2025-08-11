import React, { useEffect, useState } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Tab, Tabs } from '@mui/material';

import { OneVillageTable } from '../OneVillageTable';
import { getCommentCount, getPublicationCount, getVideoCount } from '../StatisticsUtils';
import CountryActivityPhaseAccordion from './CountryActivityPhaseAccordion';
import TabPanel from './TabPanel';
import TeamCommentCard from './TeamCommentCard';
import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import ClassroomDetailsCard from './cards/ClassroomDetailsCard/ClassroomDetailsCard';
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
import type { OneVillageTableRow } from 'types/statistics.type';
import { TeamCommentType } from 'types/teamComment.type';

const BarChartTitle = 'Evolution des connexions';

const ClassroomStats = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [selectedVillage, setSelectedVillage] = useState<number>();
  const [selectedClassroom, setSelectedClassroom] = useState<number>();
  const [familiesWithoutAccountRows, setFamiliesWithoutAccountRows] = useState<Array<OneVillageTableRow>>([]);
  const [openPhases, setOpenPhases] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
  });

  const { data: classroomsStatistics } = useStatisticsClassrooms(null, selectedCountry, null);
  const { data: sessionsStatistics } = useStatisticsSessions(null, null, 1);
  const { data: selectedClassroomStatistics } = useGetClassroomsStats(selectedClassroom, selectedPhase);

  useEffect(() => {
    if (selectedClassroomStatistics?.family?.familiesWithoutAccount) {
      setFamiliesWithoutAccountRows(createFamiliesWithoutAccountRows(selectedClassroomStatistics.family.familiesWithoutAccount));
    }
  }, [selectedClassroomStatistics?.family?.familiesWithoutAccount]);

  const videoCount = getVideoCount(selectedClassroomStatistics);
  const commentCount = getCommentCount(selectedClassroomStatistics);
  const publicationCount = getPublicationCount(selectedClassroomStatistics);

  const handleTabChange = (_event: React.SyntheticEvent, selectedTab: number) => {
    setSelectedTab(selectedTab);
  };

  return (
    <>
      <TeamCommentCard type={TeamCommentType.CLASSROOM} />
      <StatisticFilters
        onPhaseChange={setSelectedPhase}
        onCountryChange={setSelectedCountry}
        onVillageChange={setSelectedVillage}
        onClassroomChange={setSelectedClassroom}
      />
      {selectedCountry && selectedVillage && selectedClassroom ? (
        <Box mt={2}>
          <ClassroomDetailsCard />
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="basic tabs example" sx={{ py: 3 }}>
            <Tab label="En classe" />
            <Tab label="En famille" />
          </Tabs>
          <TabPanel value={selectedTab} index={0}>
            <div className="statistic__average--container">
              <AverageStatsCard
                data={{
                  min: sessionsStatistics.minDuration ? Math.floor(sessionsStatistics.minDuration / 60) : 0,
                  max: sessionsStatistics.maxDuration ? Math.floor(sessionsStatistics.maxDuration / 60) : 0,
                  average: sessionsStatistics.averageDuration ? Math.floor(sessionsStatistics.averageDuration / 60) : 0,
                  median: sessionsStatistics.medianDuration ? Math.floor(sessionsStatistics.medianDuration / 60) : 0,
                }}
                unit="min"
                icon={<AccessTimeIcon sx={{ fontSize: 'inherit' }} />}
              >
                Temps de connexion moyen par classe
              </AverageStatsCard>
              <AverageStatsCard
                data={{
                  min: sessionsStatistics.minConnections ? sessionsStatistics.minConnections : 0,
                  max: sessionsStatistics.maxConnections ? sessionsStatistics.maxConnections : 0,
                  average: sessionsStatistics.averageConnections ? sessionsStatistics.averageConnections : 0,
                  median: sessionsStatistics.medianConnections ? sessionsStatistics.medianConnections : 0,
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
            {classroomsStatistics?.phases && (
              <div className="statistic__phase--container">
                <div>
                  <PhaseDetails phase={1} data={classroomsStatistics.phases[0].data} />
                </div>
                <div className="statistic__phase">
                  <PhaseDetails phase={2} data={classroomsStatistics.phases[1].data} />
                </div>
                <div className="statistic__phase">
                  <PhaseDetails phase={3} data={classroomsStatistics.phases[1].data} />
                </div>
              </div>
            )}
            {selectedClassroom &&
              selectedVillage &&
              (selectedPhase === 0 ? (
                [1, 2, 3].map((phase) => (
                  <CountryActivityPhaseAccordion
                    key={phase}
                    phaseId={phase}
                    classroomId={selectedClassroom.toString()}
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
                  phaseId={selectedPhase}
                  classroomId={selectedClassroom.toString()}
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
              emptyPlaceholder={<p>Pas de données pour la classe sélectionnée</p>}
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
              <StatsCard data={selectedClassroomStatistics?.family?.childrenCodesCount}>Nombre de codes enfant créés</StatsCard>
              <StatsCard data={selectedClassroomStatistics?.family?.connectedFamiliesCount}>Nombre de familles connectées</StatsCard>
            </Box>
          </TabPanel>
        </Box>
      ) : (
        <PelicoCard message={'Merci de sélectionner une classe pour analyser ses statistiques'} />
      )}
    </>
  );
};

export default ClassroomStats;
