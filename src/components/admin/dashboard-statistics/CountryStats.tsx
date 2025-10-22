import React, { useState } from 'react';

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
  useGetVillages,
} from 'src/api/statistics/statistics.get';
import { useStatisticsClassrooms, useStatisticsSessions } from 'src/services/useStatistics';
import { DashboardSummaryTab } from 'types/dashboard.type';
import { TeamCommentType } from 'types/teamComment.type';

interface CountryStatsProps {
  onVillageSelect?: (villageId: number, selectedCountry?: string) => void;
}

const CountryStats: React.FC<CountryStatsProps> = ({ onVillageSelect }) => {
  const [selectedPhase, setSelectedPhase] = useState<number>();
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const [selectedTab, setSelectedTab] = useState(DashboardSummaryTab.CLASSROOM);

  const { data: countryEngagementStatus, isLoading: isLoadingCountryEngagementStatus } = useGetCountryEngagementStatus(selectedCountry);
  const { data: classroomsStatistics, isLoading: isLoadingClassroomStatistics } = useStatisticsClassrooms(null, selectedCountry, null);
  const { data: sessionsStatistics, isLoading: isLoadingSessionsStatistics } = useStatisticsSessions(null, selectedCountry, null, selectedPhase);
  const { data: countryStatistics, isLoading: isLoadingCountryStatistics } = useGetCountriesStats(selectedCountry, selectedPhase);
  const { data: engagementStatusStatistics, isLoading: isLoadingEngagementStatusStatistics } = useGetClassroomsEngagementStatus({
    countryCode: selectedCountry,
  });
  const { data: activityCountDetails, isLoading: isLoadingActivityCountDetails } = useGetCompareGlobalStats(selectedPhase || 0);
  const { data: villages, isLoading: isLoadingVillages } = useGetVillages(selectedCountry);

  const isLoadingCountryStatisticsForGraphs = isLoadingCountryEngagementStatus || isLoadingCountryStatistics || isLoadingVillages;
  const isLoadingClassroomStatisticsForWidgets =
    isLoadingClassroomStatistics ||
    isLoadingSessionsStatistics ||
    isLoadingCountryStatistics ||
    isLoadingEngagementStatusStatistics ||
    isLoadingActivityCountDetails;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
