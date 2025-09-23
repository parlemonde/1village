import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';

import EntityEngagementStatus, { EntityType } from './EntityEngagementStatus';
import Loader, { AnalyticsDataType } from './Loader';
import TeamCommentCard from './TeamCommentCard';
import VillageListCard from './cards/VillageListCard/VillageListCard';
import HorizontalBarsChart from './charts/HorizontalChart';
import DashboardSummary from './dashboard-summary/DashboardSummary';
import StatisticFilters from './filters/StatisticFilters';
import { mockDataByMonth } from './mocks/mocks';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import {
  useGetClassroomsEngagementStatus,
  useGetCountriesStats,
  useGetCountryEngagementStatus,
  useGetVillages,
} from 'src/api/statistics/statistics.get';
import { useStatisticsClassrooms, useStatisticsSessions } from 'src/services/useStatistics';
import type { CountryStat } from 'types/analytics/country-stat';
import { TeamCommentType } from 'types/teamComment.type';

interface CountryStatsProps {
  onVillageSelect?: (villageId: number, selectedCountry?: string) => void;
}

// eslint-disable-next-line react/prop-types
const CountryStats: React.FC<CountryStatsProps> = ({ onVillageSelect }) => {
  const [selectedPhase, setSelectedPhase] = useState<number>();
  const [selectedCountry, setSelectedCountry] = useState<string>();

  const [highlightedCountry, setHighlightedCountry] = useState<string>('');
  const [loadingHighlightedCountry, setLoadingHighlightedCountry] = useState<boolean>(true);
  const [barsChartData, setBarsChartData] = useState<CountryStat[]>([]);
  const [loadingBarsChartData, setLoadingBarsChartData] = useState<boolean>(true);

  const { data: countryEngagementStatus, isLoading: isLoadingCountryEngagementStatus } = useGetCountryEngagementStatus(selectedCountry);
  const { data: classroomsStatistics, isLoading: isLoadingClassroomStatistics } = useStatisticsClassrooms(null, selectedCountry, null);
  const { data: sessionsStatistics, isLoading: isLoadingSessionsStatistics } = useStatisticsSessions(null, selectedCountry, null, selectedPhase);
  const { data: familyStatistics, isLoading: isLoadingFamilyStatistics } = useGetCountriesStats(selectedCountry, selectedPhase);
  const { data: engagementStatusStatistics, isLoading: isLoadingEngagementStatusStatistics } = useGetClassroomsEngagementStatus({
    countryCode: selectedCountry,
  });
  const { data: villages, isLoading: isLoadingVillages } = useGetVillages(selectedCountry);

  // On mocke l'asynchronisme en attendant d'avoir l'appel serveur censé retourner les interactions des villages-mondes
  // A refacto lors de l'implémentation des tickets VIL-407 et VIL-63
  useEffect(() => {
    setTimeout(() => {
      const fakeHighlightedCountry: string = 'France';
      const fakeContributionsByCountry = [
        { country: 'France', total: 80 },
        { country: 'Canada', total: 70 },
        { country: 'Portugal', total: 60 },
        { country: 'Grèce', total: 50 },
        { country: 'Maroc', total: 40 },
        { country: 'Tunisie', total: 30 },
        { country: 'Belgique', total: 20 },
        { country: 'Roumanie', total: 10 },
      ];

      setHighlightedCountry(fakeHighlightedCountry);
      setLoadingHighlightedCountry(false);
      setBarsChartData(fakeContributionsByCountry);
      setLoadingBarsChartData(false);
    }, 5000);
  }, []);

  const isLoadingCountryStatistics = isLoadingCountryEngagementStatus || loadingHighlightedCountry || loadingBarsChartData || isLoadingVillages;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onCountrySelect = (_country: string) => {
    // TODO VIL-815 changer la valeur de selectedCountry quand on clique sur une barre du graphique
  };

  return (
    <>
      <TeamCommentCard type={TeamCommentType.COUNTRY} />
      <StatisticFilters onPhaseChange={setSelectedPhase} onCountryChange={setSelectedCountry} />
      {!selectedCountry ? (
        <PelicoCard message={'Merci de sélectionner un pays pour analyser ses statistiques'} />
      ) : (
        <Box mt={2}>
          {isLoadingCountryStatistics || isLoadingVillages ? (
            <Loader analyticsDataType={AnalyticsDataType.GRAPHS} />
          ) : (
            <>
              {countryEngagementStatus && <EntityEngagementStatus entityType={EntityType.COUNTRY} entityEngagementStatus={countryEngagementStatus} />}
              {highlightedCountry && barsChartData && (
                <div className={styles.simpleContainer}>
                  <HorizontalBarsChart highlightedCountry={highlightedCountry} barsChartData={barsChartData} onCountrySelect={onCountrySelect} />
                </div>
              )}
              {villages && (
                <VillageListCard
                  villageList={villages}
                  selectedCountry={selectedCountry}
                  onVillageClick={(villageId, selectedCountry) => {
                    onVillageSelect?.(villageId, selectedCountry);
                  }}
                />
              )}
            </>
          )}
          {isLoadingClassroomStatistics || isLoadingSessionsStatistics || isLoadingFamilyStatistics || isLoadingEngagementStatusStatistics ? (
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
                  engagementStatusData: engagementStatusStatistics,
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
