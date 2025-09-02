import React, { useEffect, useState } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Tab, Tabs } from '@mui/material';

import { OneVillageTable } from '../OneVillageTable';
import { getCommentCount, getPublicationCount, getVideoCount } from '../StatisticsUtils';
import CountryActivityPhaseAccordion from './CountryActivityPhaseAccordion';
import EntityEngagementStatus, { EntityType } from './EntityEngagementStatus';
import Loader, { AnalyticsDataType } from './Loader';
import TabPanel from './TabPanel';
import TeamCommentCard from './TeamCommentCard';
import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import ClassesContributionCard from './cards/ClassesContributionCard/ClassesContributionCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from './cards/StatsCard/StatsCard';
import BarCharts from './charts/BarCharts';
import type { CountryChartData } from './charts/DualBarChart/DualBarChart';
import DualBarChart from './charts/DualBarChart/DualBarChart';
import PieCharts from './charts/PieCharts';
import StatisticFilters from './filters/StatisticFilters';
import PhaseDetails from './menu/PhaseDetails';
import { mockDataByMonth } from './mocks/mocks';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import ClassroomsToMonitorTable from './tables/ClassroomsToMonitorTable';
import { createFamiliesWithoutAccountRows } from './utils/tableCreator';
import { FamiliesWithoutAccountHeaders } from './utils/tableHeader';
import { useGetClassroomsEngagementStatus, useGetVillageEngagementStatus, useGetVillagesStats } from 'src/api/statistics/statistics.get';
import { useStatisticsClassrooms, useStatisticsSessions } from 'src/services/useStatistics';
import type { OneVillageTableRow } from 'types/statistics.type';
import { TeamCommentType } from 'types/teamComment.type';

const VillageStats = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPhase, setSelectedPhase] = useState<number>();
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [selectedVillage, setSelectedVillage] = useState<number>();
  const [familiesWithoutAccountRows, setFamiliesWithoutAccountRows] = useState<Array<OneVillageTableRow>>([]);
  const [openPhases, setOpenPhases] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
  });

  const [classroomContributionsByCountry, setClassroomContributionsByCountry] = useState<CountryChartData[]>([]);
  const [isLoadingBarChartData, setIsLoadingBarChartData] = useState<boolean>(true);

  const { data: villageStatistics, isLoading: isLoadingVillageStatistics } = useGetVillagesStats(selectedVillage, selectedPhase);
  const { data: villageEngagementStatus, isLoading: isLoadingVillageEngagementStatus } = useGetVillageEngagementStatus(selectedVillage);

  const { data: classroomsStatistics, isLoading: isLoadingClassroomsStatistics } = useStatisticsClassrooms(null, selectedCountry, null);
  const { data: sessionsStatistics, isLoading: isLoadingSessionsStatistics } = useStatisticsSessions(selectedVillage, null, null, selectedPhase);
  const { data: engagementStatusStatistics, isLoading: isLoadingEngagementStatusStatistics } = useGetClassroomsEngagementStatus({
    villageId: selectedVillage,
  });

  const videoCount = getVideoCount(villageStatistics);
  const commentCount = getCommentCount(villageStatistics);
  const publicationCount = getPublicationCount(villageStatistics);

  useEffect(() => {
    if (villageStatistics?.family?.familiesWithoutAccount) {
      setFamiliesWithoutAccountRows(createFamiliesWithoutAccountRows(villageStatistics.family.familiesWithoutAccount));
    }
  }, [villageStatistics?.family?.familiesWithoutAccount]);

  const handleTabChange = (_event: React.SyntheticEvent, selectedTab: number) => {
    setSelectedTab(selectedTab);
  };

  // On mocke l'asynchronisme en attendant d'avoir l'appel serveur censé retourner les interactions des villages-mondes
  // A refacto lors de l'implémentation des tickets VIL-64, VIL-61 et VIL-10
  useEffect(() => {
    setTimeout(() => {
      const classroomContributionsByCountry = [
        {
          country: 'France',
          data: [
            { name: 'École Jules Ferry', value: 127 },
            { name: 'École Jean Jaurès', value: 98 },
            { name: 'École Victor Hugo', value: 156 },
            { name: 'École Saint-Exupéry', value: 89 },
            { name: 'École Louis Pasteur', value: 142 },
            { name: 'École Marie Curie', value: 113 },
            { name: 'École Jean Moulin', value: 134 },
          ],
        },
        {
          country: 'Canada',
          data: [
            { name: 'École Champlain', value: 108 },
            { name: 'École Cartier', value: 145 },
            { name: 'École Garneau', value: 92 },
            { name: 'École Frontenac', value: 167 },
            { name: 'École Maisonneuve', value: 124 },
            { name: 'École Montcalm', value: 96 },
            { name: 'École Papineau', value: 138 },
          ],
        },
      ];

      setClassroomContributionsByCountry(classroomContributionsByCountry);
      setIsLoadingBarChartData(false);
    }, 5000);
  }, []);

  const isLoadingGraphsData = isLoadingVillageEngagementStatus || isLoadingClassroomsStatistics;

  return (
    <>
      <TeamCommentCard type={TeamCommentType.VILLAGE} />
      <StatisticFilters onPhaseChange={setSelectedPhase} onCountryChange={setSelectedCountry} onVillageChange={setSelectedVillage} />
      {selectedCountry && selectedVillage ? (
        <>
          {isLoadingGraphsData ? (
            <Loader analyticsDataType={AnalyticsDataType.GRAPHS} />
          ) : (
            <>
              {villageEngagementStatus && <EntityEngagementStatus entityType={EntityType.VILLAGE} entityEngagementStatus={villageEngagementStatus} />}
              {classroomContributionsByCountry && <DualBarChart data={classroomContributionsByCountry} />}
            </>
          )}
          {isLoadingClassroomsStatistics || isLoadingSessionsStatistics || isLoadingVillageStatistics || isLoadingEngagementStatusStatistics ? (
            <Loader analyticsDataType={AnalyticsDataType.WIDGETS} />
          ) : (
            <>
              <Tabs value={selectedTab} onChange={handleTabChange} aria-label="Données par classe ou par famille" sx={{ py: 3 }}>
                <Tab label="En classe" />
                <Tab label="En famille" />
              </Tabs>
              <TabPanel value={selectedTab} index={0}>
                <ClassroomsToMonitorTable villageId={selectedVillage} countryId={selectedCountry} />
                <br />
                <div className="statistic--container">
                  <StatsCard data={sessionsStatistics.registeredClassroomsCount ?? 0}>Nombre de classes inscrites</StatsCard>
                  <StatsCard data={sessionsStatistics.connectedClassroomsCount ?? 0}>Nombre de classes connectées</StatsCard>
                  <StatsCard data={sessionsStatistics.contributedClassroomsCount ?? 0}>Nombre de classes contributrices</StatsCard>
                </div>
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
                      min: sessionsStatistics.minConnections ?? 0,
                      max: sessionsStatistics.maxConnections ?? 0,
                      average: sessionsStatistics.averageConnections ?? 0,
                      median: sessionsStatistics.medianConnections ?? 0,
                    }}
                    icon={<VisibilityIcon sx={{ fontSize: 'inherit' }} />}
                  >
                    Nombre de connexions moyen par classe
                  </AverageStatsCard>
                </div>
                <div className="statistic__average--container">
                  {engagementStatusStatistics && <PieCharts engagementStatusData={engagementStatusStatistics} />}
                  <BarCharts dataByMonth={mockDataByMonth} title="Évolution des connexions" />
                </div>
                <div className="statistic__average--container">
                  <ClassesExchangesCard totalPublications={publicationCount} totalComments={commentCount} totalVideos={videoCount} />
                  <ClassesContributionCard data={sessionsStatistics.contributionsBarChartData} />
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
                {selectedVillage &&
                  selectedPhase &&
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
                  emptyPlaceholder={<p>Pas de données pour le Village-Monde sélectionné</p>}
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
              </TabPanel>
            </>
          )}
        </>
      ) : (
        <PelicoCard message={'Merci de sélectionner un village-monde pour analyser ses statistiques'} />
      )}
    </>
  );
};

export default VillageStats;
