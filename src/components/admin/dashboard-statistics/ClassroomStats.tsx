import React, { useEffect, useState } from 'react';

import { Box, Tab, Tabs } from '@mui/material';

import { OneVillageTable } from '../OneVillageTable';
import CountryActivityPhaseAccordion from './CountryActivityPhaseAccordion';
import EntityEngagementStatus, { EntityType } from './EntityEngagementStatus';
import Loader, { AnalyticsDataType } from './Loader';
import TabPanel from './TabPanel';
import TeamCommentCard from './TeamCommentCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import ClassroomDetailsCard from './cards/ClassroomDetailsCard/ClassroomDetailsCard';
import StatsCard from './cards/StatsCard/StatsCard';
import BarChartWithMonthSelector from './charts/BarChartWithMonthSelector';
import StatisticFilters from './filters/StatisticFilters';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import { createFamiliesWithoutAccountRows } from './utils/tableCreator';
import { FamiliesWithoutAccountHeaders } from './utils/tableHeader';
import { useGetClassroomIdentity, useGetClassroomEngagementStatus, useGetClassroomsStats } from 'src/api/statistics/statistics.get';
import { useStatisticsSessions } from 'src/services/useStatistics';
import type { OneVillageTableRow } from 'types/statistics.type';
import { TeamCommentType } from 'types/teamComment.type';

type Props = {
  classroomId?: number;
  villageId?: number;
  countryId?: string;
};

const ClassroomStats = ({ classroomId, villageId, countryId }: Props) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPhase, setSelectedPhase] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [selectedVillage, setSelectedVillage] = useState<number>();
  const [selectedClassroom, setSelectedClassroom] = useState<number>();
  const [familiesWithoutAccountRows, setFamiliesWithoutAccountRows] = useState<Array<OneVillageTableRow>>([]);
  const [openPhases, setOpenPhases] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
  });

  const { data: classroomIdentityDetails, isLoading: isLoadingClassroomIdentityDetails } = useGetClassroomIdentity(selectedClassroom);
  const { data: classroomEngagementStatus, isLoading: isLoadingClassroomEngagementStatus } = useGetClassroomEngagementStatus(selectedClassroom);
  const { data: sessionsStatistics, isLoading: isLoadingSessionsStatistics } = useStatisticsSessions(null, null, selectedClassroom);
  const { data: selectedClassroomStatistics, isLoading: isLoadingSelectedClassroomsStatistics } = useGetClassroomsStats(
    selectedClassroom,
    selectedPhase,
  );

  const totalActivitiesCounts = selectedClassroomStatistics?.totalActivityCounts;

  useEffect(() => {
    if (selectedClassroomStatistics?.family?.familiesWithoutAccount) {
      setFamiliesWithoutAccountRows(createFamiliesWithoutAccountRows(selectedClassroomStatistics.family.familiesWithoutAccount));
    }
  }, [selectedClassroomStatistics?.family?.familiesWithoutAccount]);

  useEffect(() => {
    if (countryId) {
      setSelectedCountry(countryId);
    }
    if (villageId) {
      setSelectedVillage(villageId);
    }
    if (classroomId) {
      setSelectedClassroom(classroomId);
    }
  }, [countryId, villageId, classroomId]);

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
        selectedCountry={selectedCountry}
        selectedVillage={selectedVillage}
        selectedClassroom={selectedClassroom}
      />
      {selectedCountry && selectedVillage && selectedClassroom ? (
        <Box mt={2}>
          {isLoadingClassroomEngagementStatus || isLoadingClassroomIdentityDetails ? (
            <Loader analyticsDataType={AnalyticsDataType.GRAPHS} />
          ) : (
            <>
              {classroomEngagementStatus && (
                <EntityEngagementStatus entityType={EntityType.CLASSROOM} entityEngagementStatus={classroomEngagementStatus} />
              )}
              {classroomIdentityDetails && <ClassroomDetailsCard classroomIdentityDetails={classroomIdentityDetails} />}
            </>
          )}
          {isLoadingSelectedClassroomsStatistics || isLoadingSessionsStatistics ? (
            <Loader analyticsDataType={AnalyticsDataType.WIDGETS} />
          ) : (
            <>
              <Tabs value={selectedTab} onChange={handleTabChange} aria-label="Données par classe ou par famille" sx={{ py: 3 }}>
                <Tab label="En classe" />
                <Tab label="En famille" />
              </Tabs>
              <TabPanel value={selectedTab} index={0}>
                {/* VIL-824 : invisibiliser ces éléments dans le dashboard */}
                {/* <div className="statistic__average--container">
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
                      min: sessionsStatistics.minConnections ?? 0,
                      max: sessionsStatistics.maxConnections ?? 0,
                      average: sessionsStatistics.averageConnections ?? 0,
                      median: sessionsStatistics.medianConnections ?? 0,
                    }}
                    icon={<VisibilityIcon sx={{ fontSize: 'inherit' }} />}
                  >
                    Nombre de connexions moyen par classe
                  </AverageStatsCard>
                </div> */}
                <div className="statistic--container">
                  <BarChartWithMonthSelector data={sessionsStatistics.dailyConnectionsCountsByMonth} title="Évolution des connexions" />
                </div>
                <div style={{ marginTop: '2.5rem' }}>
                  <ClassesExchangesCard
                    totalPublications={totalActivitiesCounts?.totalPublications || 0}
                    totalComments={totalActivitiesCounts?.totalComments || 0}
                    totalVideos={totalActivitiesCounts?.totalVideos || 0}
                  />
                </div>

                {selectedClassroom &&
                  selectedVillage &&
                  (selectedPhase === 0 ? (
                    [1, 2, 3].map((phase) => (
                      <CountryActivityPhaseAccordion
                        key={phase}
                        phaseId={phase}
                        classroomId={selectedClassroom}
                        villageId={selectedVillage}
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
                      classroomId={selectedClassroom}
                      villageId={selectedVillage}
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
                <div className="statistic--container">
                  <BarChartWithMonthSelector data={sessionsStatistics.dailyConnectionsCountsByMonth} title="Évolution des connexions" />
                </div>
              </TabPanel>
            </>
          )}
        </Box>
      ) : (
        <PelicoCard message={'Merci de sélectionner une classe pour analyser ses statistiques'} />
      )}
    </>
  );
};

export default ClassroomStats;
