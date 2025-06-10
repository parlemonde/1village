import React, { useState } from 'react';

import VillageListCard from './cards/VillageListCard/VillageListCard';
import HorizontalBarsChart from './charts/HorizontalChart';
import DashboardSummary from './dashboard-summary/DashboardSummary';
import CountriesDropdown from './filters/CountriesDropdown';
import PhaseDropdown from './filters/PhaseDropdown';
import { mockDataByMonth } from './mocks/mocks';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import { useGetCountriesStats } from 'src/api/statistics/statistics.get';
import { useCountries } from 'src/services/useCountries';
import { useStatisticsClassrooms, useStatisticsSessions } from 'src/services/useStatistics';
import type { ClassroomsStats, SessionsStats } from 'types/statistics.type';

const CountryStats = () => {
  const [selectedPhase, setSelectedPhase] = React.useState<number>(0);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const pelicoMessage = 'Merci de sélectionner un pays pour analyser ses statistiques ';
  const statisticsClassrooms = useStatisticsClassrooms(null, selectedCountry, null) as ClassroomsStats;
  const statisticsSessions: SessionsStats = useStatisticsSessions(null, selectedCountry, null) as SessionsStats;

  const statisticsFamily = useGetCountriesStats(selectedCountry, selectedPhase);

  const { countries } = useCountries({ hasVillage: true });
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
  };

  const handlePhaseChange = (phase: string) => {
    setSelectedPhase(+phase);
  };

  return (
    <>
      <div className={styles.filtersContainer}>
        <div className={styles.smallFilter}>
          <PhaseDropdown onPhaseChange={handlePhaseChange} />
        </div>
        <div className={styles.medFilter}>
          <CountriesDropdown countries={countries} onCountryChange={handleCountryChange} />
        </div>
        <div className={styles.medFilter} />
        <div className={styles.medFilter} />
      </div>
      {!selectedCountry || !statisticsFamily.data ? (
        <PelicoCard message={pelicoMessage} />
      ) : (
        <>
          <div className={styles.simpleContainer}>
            <HorizontalBarsChart highlightCountry="FR"></HorizontalBarsChart>
          </div>
          <VillageListCard></VillageListCard>
          <DashboardSummary data={{ ...statisticsSessions, ...statisticsClassrooms, ...statisticsFamily.data, barChartData: mockDataByMonth }} />
        </>
      )}
    </>
  );
};

export default CountryStats;
