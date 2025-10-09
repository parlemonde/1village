import { useEffect, useState } from 'react';

import { Box, Tab, Tabs } from '@mui/material';

import EntityEngagementStatus, { EntityType } from './EntityEngagementStatus';
import Loader, { AnalyticsDataType } from './Loader';
import TeamCommentCard from './TeamCommentCard';
import VillageListCard from './cards/VillageListCard/VillageListCard';
import HorizontalBarChart from './charts/HorizontalBarChart';
import DashboardSummary from './dashboard-summary/DashboardSummary';
import StatisticFilters from './filters/StatisticFilters';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import {
  useGetClassroomsEngagementStatus,
  useGetCompareGlobalStats,
  useGetCountriesStats,
  useGetCountryEngagementStatus,
} from 'src/api/statistics/statistics.get';
import { useStatisticsClassrooms, useStatisticsSessions } from 'src/services/useStatistics';
import type { VillageListItem } from 'types/analytics/village-list-item';
import { DashboardSummaryTab } from 'types/dashboard.type';
import { TeamCommentType } from 'types/teamComment.type';

const CountryStats = () => {
  const [selectedPhase, setSelectedPhase] = useState<number>();
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [selectedTab, setSelectedTab] = useState(DashboardSummaryTab.CLASSROOM);

  const [villageList, setVillageList] = useState<VillageListItem[]>([]);
  const [loadingVillageList, setLoadingVillageList] = useState<boolean>(true);

  const { data: countryEngagementStatus, isLoading: isLoadingCountryEngagementStatus } = useGetCountryEngagementStatus(selectedCountry);
  const { data: classroomsStatistics, isLoading: isLoadingClassroomStatistics } = useStatisticsClassrooms(null, selectedCountry, null);
  const { data: sessionsStatistics, isLoading: isLoadingSessionsStatistics } = useStatisticsSessions(null, selectedCountry, null, selectedPhase);
  const { data: countryStatistics, isLoading: isLoadingCountryStatistics } = useGetCountriesStats(selectedCountry, selectedPhase);
  const { data: engagementStatusStatistics, isLoading: isLoadingEngagementStatusStatistics } = useGetClassroomsEngagementStatus({
    countryCode: selectedCountry,
  });
  const { data: activityCountDetails, isLoading: isLoadingActivityCountDetails } = useGetCompareGlobalStats(selectedPhase || 0);

  // On mocke l'asynchronisme en attendant d'avoir l'appel serveur censé retourner les interactions des villages-mondes
  // A refacto lors de l'implémentation des tickets VIL-407 et VIL-63
  useEffect(() => {
    setTimeout(() => {
      const fakeVillageListData = [
        { name: 'Village France - Canada', color: 'green' },
        { name: 'Village France - Liban', color: 'orange' },
        { name: 'Village France - Italie', color: 'gold' },
        { name: 'Village France - Hongrie', color: 'yellow' },
        { name: 'Village France - Belgique', color: 'green' },
        { name: 'Village France - Angleterre', color: 'limegreen' },
        { name: 'Village France - Mexique', color: 'blue' },
        { name: 'Village France - Russie', color: 'red' },
        { name: 'Village France - Australie', color: 'orange' },
      ];

      setVillageList(fakeVillageListData);
      setLoadingVillageList(false);
    }, 5000);
  }, []);

  const isLoadingCountryStatisticsForGraphs = isLoadingCountryEngagementStatus || isLoadingCountryStatistics || loadingVillageList;
  const isLoadingClassroomStatisticsForWidgets =
    isLoadingClassroomStatistics ||
    isLoadingSessionsStatistics ||
    isLoadingCountryStatistics ||
    isLoadingEngagementStatusStatistics ||
    isLoadingActivityCountDetails;

  const onCountrySelect = (_country: string) => {
    // TODO VIL-815 changer la valeur de selectedCountry quand on clique sur une barre du graphique
  };

  const handleTabChange = (_event: React.SyntheticEvent, selectedTab: number) => {
    setSelectedTab(selectedTab);
  };

  return (
    <>
      <TeamCommentCard type={TeamCommentType.COUNTRY} />
      <StatisticFilters onPhaseChange={setSelectedPhase} onCountryChange={setSelectedCountry} />
      {!selectedCountry ? (
        <PelicoCard message={'Merci de sélectionner un pays pour analyser ses statistiques'} />
      ) : (
        <Box mt={2}>
          {isLoadingCountryStatisticsForGraphs ? (
            <Loader analyticsDataType={AnalyticsDataType.GRAPHS} />
          ) : (
            <>
              {countryEngagementStatus && <EntityEngagementStatus entityType={EntityType.COUNTRY} entityEngagementStatus={countryEngagementStatus} />}
              {countryStatistics?.contributionsByCountry && (
                <div className={styles.simpleContainer}>
                  <HorizontalBarChart
                    selectedCountry={selectedCountry}
                    barsChartData={countryStatistics.contributionsByCountry}
                    onCountrySelect={onCountrySelect}
                  />
                </div>
              )}
              {villageList && <VillageListCard villageList={villageList} />}
            </>
          )}
          {isLoadingClassroomStatisticsForWidgets ? (
            <Loader analyticsDataType={AnalyticsDataType.WIDGETS} />
          ) : (
            classroomsStatistics &&
            sessionsStatistics &&
            countryStatistics && (
              <>
                <Tabs value={selectedTab} onChange={handleTabChange} sx={{ py: 3 }}>
                  <Tab value={DashboardSummaryTab.CLASSROOM} label="En classe" />
                  <Tab value={DashboardSummaryTab.FAMILY} label="En famille" />
                </Tabs>
                <DashboardSummary
                  dashboardSummaryData={{
                    ...classroomsStatistics,
                    ...sessionsStatistics,
                    ...countryStatistics,
                    ...activityCountDetails,
                    engagementStatusData: engagementStatusStatistics,
                  }}
                  selectedCountry={selectedCountry}
                  selectedPhase={selectedPhase}
                  activeTab={selectedTab}
                />
              </>
            )
          )}
        </Box>
      )}
    </>
  );
};

export default CountryStats;
