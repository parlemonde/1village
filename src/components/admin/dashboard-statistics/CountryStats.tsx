import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';

import Loader, { AnalyticsDataType } from './Loader';
import TeamCommentCard from './TeamCommentCard';
import VillageListCard from './cards/VillageListCard/VillageListCard';
import HorizontalBarsChart from './charts/HorizontalChart';
import DashboardSummary from './dashboard-summary/DashboardSummary';
import StatisticFilters from './filters/StatisticFilters';
import { mockDataByMonth } from './mocks/mocks';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import { useGetClassroomsEngagementLevel, useGetCountriesStats } from 'src/api/statistics/statistics.get';
import { useStatisticsClassrooms, useStatisticsSessions } from 'src/services/useStatistics';
import type { CountryStat } from 'types/analytics/country-stat';
import type { VillageListItem } from 'types/analytics/village-list-item';
import { TeamCommentType } from 'types/teamComment.type';

const CountryStats = () => {
  const [selectedPhase, setSelectedPhase] = useState<number>();
  const [selectedCountry, setSelectedCountry] = useState<string>();

  const [highlightedCountry, setHighlightedCountry] = useState<string>('');
  const [loadingHighlightedCountry, setLoadingHighlightedCountry] = useState<boolean>(true);
  const [barsChartData, setBarsChartData] = useState<CountryStat[]>([]);
  const [loadingBarsChartData, setLoadingBarsChartData] = useState<boolean>(true);
  const [villageList, setVillageList] = useState<VillageListItem[]>([]);
  const [loadingVillageList, setLoadingVillageList] = useState<boolean>(true);

  const { data: classroomsStatistics, isLoading: isLoadingClassroomStatistics } = useStatisticsClassrooms(null, selectedCountry, null);
  const { data: sessionsStatistics, isLoading: isLoadingSessionsStatistics } = useStatisticsSessions(null, selectedCountry, null, selectedPhase);
  const { data: familyStatistics, isLoading: isLoadingFamilyStatistics } = useGetCountriesStats(selectedCountry, selectedPhase);
  const { data: engagementLevelStatistics, isLoading: isLoadingEngagementLevelStatistics } = useGetClassroomsEngagementLevel({
    countryCode: selectedCountry,
  });

  // On mocke l'asynchronisme en attendant d'avoir l'appel serveur censé retourner les interactions des villages-mondes
  // A refacto lors de l'implémentation des tickets VIL-407 et VIL-63
  useEffect(() => {
    setTimeout(() => {
      const fakeHighlightedCountry: string = 'FR';
      const fakeBarsChartData = [
        { country: 'FR', total: 80 },
        { country: 'CA', total: 70 },
        { country: 'PT', total: 60 },
        { country: 'Grèce', total: 50 },
        { country: 'Maroc', total: 40 },
        { country: 'Tunisie', total: 30 },
        { country: 'Belgique', total: 20 },
        { country: 'Roumanie', total: 10 },
      ];
      const fakeVillageListData = [
        { name: 'Village France - Canada', color: 'green' },
        { name: 'Village France - Liban', color: 'orange' },
        { name: 'Village France - Italie', color: 'gold' },
        { name: 'Village France - Canada', color: 'yellow' },
        { name: 'Village France - Liban', color: 'green' },
        { name: 'Village France - Italie', color: 'limegreen' },
        { name: 'Village France - Canada', color: 'blue' },
        { name: 'Village France - Liban', color: 'red' },
        { name: 'Village France - Italie', color: 'orange' },
      ];

      setHighlightedCountry(fakeHighlightedCountry);
      setLoadingHighlightedCountry(false);
      setBarsChartData(fakeBarsChartData);
      setLoadingBarsChartData(false);
      setVillageList(fakeVillageListData);
      setLoadingVillageList(false);
    }, 5000);
  }, []);

  return (
    <>
      <TeamCommentCard type={TeamCommentType.COUNTRY} />
      <StatisticFilters onPhaseChange={setSelectedPhase} onCountryChange={setSelectedCountry} />
      {!selectedCountry || !familyStatistics ? (
        <PelicoCard message={'Merci de sélectionner un pays pour analyser ses statistiques'} />
      ) : (
        <Box mt={2}>
          {loadingHighlightedCountry || loadingBarsChartData || loadingVillageList ? (
            <Loader analyticsDataType={AnalyticsDataType.GRAPHS} />
          ) : (
            highlightedCountry &&
            barsChartData &&
            villageList && (
              <>
                <div className={styles.simpleContainer}>
                  <HorizontalBarsChart highlightedCountry={highlightedCountry} barsChartData={barsChartData} />
                </div>
                <VillageListCard villageList={villageList} />
              </>
            )
          )}
          {isLoadingClassroomStatistics || isLoadingSessionsStatistics || isLoadingFamilyStatistics || isLoadingEngagementLevelStatistics ? (
            <Loader analyticsDataType={AnalyticsDataType.WIDGETS} />
          ) : (
            classroomsStatistics &&
            sessionsStatistics &&
            familyStatistics && (
              <DashboardSummary
                dashboardSummaryData={{
                  ...classroomsStatistics,
                  ...sessionsStatistics,
                  ...familyStatistics,
                  barChartData: mockDataByMonth,
                  engagementLevelData: engagementLevelStatistics,
                }}
                selectedCountry={selectedCountry}
                selectedPhase={selectedPhase}
              />
            )
          )}
        </Box>
      )}
    </>
  );
};

export default CountryStats;
