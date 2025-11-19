import React, { useState, useEffect } from 'react';

import { Tabs, Tab, Box } from '@mui/material';

import { OneVillageTable } from '../OneVillageTable';
import CountryActivityPhaseAccordion from './CountryActivityPhaseAccordion';
import EntityEngagementStatus, { EntityType } from './EntityEngagementStatus';
import Loader, { AnalyticsDataType } from './Loader';
import TabPanel from './TabPanel';
import TeamCommentCard from './TeamCommentCard';
import ClassesContributionCard from './cards/ClassesContributionCard/ClassesContributionCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from './cards/StatsCard/StatsCard';
import BarChartWithMonthSelector from './charts/BarChartWithMonthSelector';
import DualBarChart from './charts/DualBarChart/DualBarChart';
import PieCharts from './charts/PieCharts';
import StatisticFilters from './filters/StatisticFilters';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import ClassroomsToMonitorTable from './tables/ClassroomsToMonitorTable';
import { createFamiliesWithoutAccountRows } from './utils/tableCreator';
import { FamiliesWithoutAccountHeaders } from './utils/tableHeader';
import { useGetVillagesStats, useGetVillageEngagementStatus, useGetClassroomsEngagementStatus } from 'src/api/statistics/statistics.get';
import { useStatisticsSessions } from 'src/services/useStatistics';
import type { OneVillageTableRow } from 'types/statistics.type';
import { TeamCommentType } from 'types/teamComment.type';

interface VillageStatsProps {
  selectedCountry?: string;
  selectedVillage?: number;
  onResetFilters?: () => void;
}

const VillageStats: React.FC<VillageStatsProps> = ({ selectedCountry: initialCountry, selectedVillage: initialVillage, onResetFilters }) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedPhase, setSelectedPhase] = useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(initialCountry);
  const [selectedVillage, setSelectedVillage] = useState<number | undefined>(initialVillage);
  const [familiesWithoutAccountRows, setFamiliesWithoutAccountRows] = useState<Array<OneVillageTableRow>>([]);
  const [openPhases, setOpenPhases] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
  });

  const { data: villageStatistics, isLoading: isLoadingVillageStatistics } = useGetVillagesStats(selectedVillage, selectedPhase);
  const { data: villageEngagementStatus, isLoading: isLoadingVillageEngagementStatus } = useGetVillageEngagementStatus(selectedVillage);

  const { data: sessionsStatistics, isLoading: isLoadingSessionsStatistics } = useStatisticsSessions(selectedVillage, null, null, selectedPhase);
  const { data: engagementStatusStatistics, isLoading: isLoadingEngagementStatusStatistics } = useGetClassroomsEngagementStatus({
    villageId: selectedVillage,
  });

  const totalActivitiesCounts = villageStatistics?.totalActivityCounts;

  // Pour éviter de ré-appliquer les props à chaque changement, on ne synchronise qu'au premier render :
  useEffect(() => {
    if (initialCountry) setSelectedCountry(initialCountry);
    if (initialVillage) setSelectedVillage(initialVillage);
  }, [initialCountry, initialVillage]);

  useEffect(() => {
    // Cleanup au démontage
    return () => {
      if (onResetFilters) onResetFilters();
    };
  }, [onResetFilters]);

  useEffect(() => {
    if (villageStatistics?.family?.familiesWithoutAccount) {
      setFamiliesWithoutAccountRows(createFamiliesWithoutAccountRows(villageStatistics.family.familiesWithoutAccount));
    }
  }, [villageStatistics?.family?.familiesWithoutAccount]);

  const handleTabChange = (_event: React.SyntheticEvent, selectedTab: number) => {
    setSelectedTab(selectedTab);
  };

  const isLoadingGraphsData = isLoadingVillageEngagementStatus || isLoadingVillageStatistics;

  return (
    <>
      <TeamCommentCard type={TeamCommentType.VILLAGE} />
      <StatisticFilters
        onPhaseChange={setSelectedPhase}
        onCountryChange={setSelectedCountry}
        onVillageChange={setSelectedVillage}
        selectedPhase={selectedPhase}
        selectedCountry={selectedCountry}
        selectedVillage={selectedVillage}
      />
      {selectedCountry && selectedVillage ? (
        <>
          {isLoadingGraphsData ? (
            <Loader analyticsDataType={AnalyticsDataType.GRAPHS} />
          ) : (
            <>
              {villageEngagementStatus && <EntityEngagementStatus entityType={EntityType.VILLAGE} entityEngagementStatus={villageEngagementStatus} />}
              {villageStatistics?.contributionsByCountryClassrooms && (
                <DualBarChart contributionsByCountryClassrooms={villageStatistics.contributionsByCountryClassrooms} />
              )}
            </>
          )}
          {isLoadingSessionsStatistics || isLoadingVillageStatistics || isLoadingEngagementStatusStatistics ? (
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
                <div className="statistic--container" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <StatsCard data={sessionsStatistics.registeredClassroomsCount ?? 0} style={{ height: 'auto', width: '100%' }}>
                    Nombre de classes inscrites
                  </StatsCard>
                  <StatsCard data={sessionsStatistics.connectedClassroomsCount ?? 0}>Nombre de classes connectées</StatsCard>
                  <StatsCard data={sessionsStatistics.contributedClassroomsCount ?? 0}>Nombre de classes contributrices</StatsCard>
                </div>
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
                <Box
                  className="statistic__average--container"
                  sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr', lg: '1fr 2fr' }, gap: 2, mt: 2 }}
                >
                  {engagementStatusStatistics && <PieCharts engagementStatusData={engagementStatusStatistics} />}
                  <span style={{ marginLeft: '14px' }}>
                    <BarChartWithMonthSelector data={sessionsStatistics.dailyConnectionsCountsByMonth} title="Évolution des connexions" />
                  </span>
                </Box>
                <div className="statistic__average--container" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gridGap: '2rem' }}>
                  <ClassesExchangesCard
                    totalPublications={totalActivitiesCounts?.totalPublications || 0}
                    totalComments={totalActivitiesCounts?.totalComments || 0}
                    totalVideos={totalActivitiesCounts?.totalVideos || 0}
                    enableColumns={true}
                  />
                  <ClassesContributionCard data={sessionsStatistics.contributionsBarChartData} />
                </div>

                {selectedVillage &&
                  (selectedPhase === 0 ? (
                    [1, 2, 3].map((phase) => (
                      <CountryActivityPhaseAccordion
                        key={phase}
                        phaseId={phase}
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
                  <StatsCard data={villageStatistics?.family?.childrenCodesCount} style={{ width: '100%', height: 'auto' }}>
                    Nombre de codes enfant créés
                  </StatsCard>
                  <StatsCard data={villageStatistics?.family?.connectedFamiliesCount}>Nombre de familles connectées</StatsCard>
                </Box>
                <div className="statistic--container">
                  <BarChartWithMonthSelector data={sessionsStatistics.dailyConnectionsCountsByMonth} title="Évolution des connexions" />
                </div>
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
