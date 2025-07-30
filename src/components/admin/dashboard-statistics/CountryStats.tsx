import React, { useState } from 'react';

import Box from '@mui/material/Box';

import { TeamCommentType } from '../../../../types/teamComment.type';
import TeamCommentCard from './TeamCommentCard';
import VillageListCard from './cards/VillageListCard/VillageListCard';
import HorizontalBarsChart from './charts/HorizontalChart';
import DashboardSummary from './dashboard-summary/DashboardSummary';
import StatisticFilters from './filters/StatisticFilters';
import { mockDataByMonth } from './mocks/mocks';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import { useGetCountriesStats } from 'src/api/statistics/statistics.get';
import { useStatisticsClassrooms, useStatisticsSessions } from 'src/services/useStatistics';
import type { ClassroomsStats, SessionsStats } from 'types/statistics.type';

const CountryStats = () => {
  const [selectedPhase, setSelectedPhase] = useState<number>();
  const [selectedCountry, setSelectedCountry] = useState<string>();
  const pelicoMessage = 'Merci de sélectionner un pays pour analyser ses statistiques ';

  const statisticsClassrooms = useStatisticsClassrooms(null, selectedCountry, null) as ClassroomsStats;
  const statisticsSessions: SessionsStats = useStatisticsSessions(null, selectedCountry, null) as SessionsStats;
  const statisticsFamily = useGetCountriesStats(selectedCountry, selectedPhase);

  return (
    <>
      <TeamCommentCard type={TeamCommentType.COUNTRY} />
      <StatisticFilters onPhaseChange={setSelectedPhase} onCountryChange={setSelectedCountry} />
      {!selectedCountry || !statisticsFamily.data ? (
        <PelicoCard message={pelicoMessage} />
      ) : (
        <Box mt={2}>
          <div className={styles.simpleContainer}>
            <HorizontalBarsChart highlightCountry="FR" />
          </div>
          <VillageListCard />
          <DashboardSummary
            data={{ ...statisticsSessions, ...statisticsClassrooms, ...statisticsFamily.data, barChartData: mockDataByMonth }}
            selectedCountry={selectedCountry}
            selectedPhase={selectedPhase}
          />
        </Box>
      )}
    </>
  );
};

export default CountryStats;
