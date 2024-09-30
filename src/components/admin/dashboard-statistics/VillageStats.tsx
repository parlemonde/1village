import React, { useState } from 'react';

import StatsCard from './cards/StatsCard/StatsCard';
import CountriesDropdown from './filters/CountriesDropdown';
import PhaseDropdown from './filters/PhaseDropdown';
import VillageDropdown from './filters/VillageDropdown';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import { useGetVillagesStats } from 'src/api/statistics/statistics.get';
import { useCountries } from 'src/services/useCountries';
import { useVillages } from 'src/services/useVillages';

const VillageStats = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>(''); // Default to 'FR' initially
  const [selectedVillage, setSelectedVillage] = useState<number | null>(null);

  const pelicoMessage = 'Merci de sélectionner un village-monde pour analyser ses statistiques ';

  const { countries } = useCountries();

  const { villages } = useVillages(selectedCountry); // Dynamically pass the selected country
  const villagesStats = useGetVillagesStats(selectedVillage);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedVillage(null);
  };

  const handleVillageChange = (village: { name: string; id: number }) => {
    setSelectedVillage(village.id);
  };

  return (
    <>
      <div className={styles.filtersContainer}>
        <div className={styles.phaseFilter}>
          <PhaseDropdown />
        </div>
        <div className={styles.countryFilter}>
          <CountriesDropdown countries={countries} onCountryChange={handleCountryChange} />
        </div>
        <div className={styles.countryFilter}>
          <VillageDropdown villages={villages} onVillageChange={handleVillageChange} />
        </div>
      </div>
      {!selectedVillage ? (
        <PelicoCard message={pelicoMessage} />
      ) : (
        <div className={styles.classroomStats}>
          <StatsCard data={villagesStats.data?.familyAccountsCount}>Nombre de profs ayant créé des comptes famille</StatsCard>
          <StatsCard data={villagesStats.data?.childrenCodesCount}>Nombre de codes enfant créés</StatsCard>
          <StatsCard data={villagesStats.data?.connectedFamiliesCount}>Nombre de familles connectées</StatsCard>
        </div>
      )}
    </>
  );
};

export default VillageStats;
