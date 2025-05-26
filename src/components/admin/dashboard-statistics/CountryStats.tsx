import React, { useState } from 'react';

import VillageListCard from './cards/VillageListCard/VillageListCard';
import HorizontalBarsChart from './charts/HorizontalChart';
import DashboardSummary from './dashboard-summary/DashboardSummary';
import CountriesDropdown from './filters/CountriesDropdown';
import { mockDataByMonth } from './mocks/mocks';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import { useCountries } from 'src/services/useCountries';
import { useStatisticsClassrooms, useStatisticsSessions } from 'src/services/useStatistics';
import type { ClassroomsStats, SessionsStats, VillageStats } from 'types/statistics.type';

const mockStatisticsFamily: VillageStats = {
  floatingAccounts: [],
  familiesWithoutAccount: [],
  childrenCodesCount: 0,
  connectedFamiliesCount: 0,
  familyAccountsCount: 0,
};

const CountryStats = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const pelicoMessage = 'Merci de sélectionner un pays pour analyser ses statistiques ';
  const statisticsClassrooms = useStatisticsClassrooms(null, selectedCountry, null) as ClassroomsStats;
  const statisticsSessions: SessionsStats = useStatisticsSessions(null, selectedCountry, null) as SessionsStats;

  const { countries } = useCountries();
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
  };

  return (
    <>
      <div className={styles.filtersContainer}>
        <div className={styles.smallFilter}></div>
        <div className={styles.medFilter}>
          <CountriesDropdown countries={countries} onCountryChange={handleCountryChange} />
        </div>
        <div className={styles.medFilter} />
        <div className={styles.medFilter} />
      </div>
      {!selectedCountry ? (
        <PelicoCard message={pelicoMessage} />
      ) : (
        <>
          <div className={styles.simpleContainer}>
            <HorizontalBarsChart highlightCountry="FR"></HorizontalBarsChart>
          </div>
          <VillageListCard></VillageListCard>
          <DashboardSummary data={{ ...statisticsSessions, ...statisticsClassrooms, ...mockStatisticsFamily, barChartData: mockDataByMonth }} />
        </>
      )}
    </>
  );
};

export default CountryStats;
