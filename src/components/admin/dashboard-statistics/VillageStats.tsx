import React, { useState } from 'react';

import StatsCard from './cards/StatsCard/StatsCard';
import CountriesDropdown from './filters/CountriesDropdown';
import PhaseDropdown from './filters/PhaseDropdown';
import VillageDropdown from './filters/VillageDropdown';
import { mockClassroomsStats } from './mocks/mocks';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import { useGetVillagesStats } from 'src/api/statistics/statistics.get';

const VillageStats = () => {
  const villagesStats = useGetVillagesStats(1);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedVillage, setSelectedVillage] = useState<{ name: string; id: number }>();

  const pelicoMessage = 'Merci de sélectionner un village-monde pour analyser ses statistiques ';

  const countriesMap = mockClassroomsStats.map((country) => country.classroomCountryCode);
  const countries = [...new Set(countriesMap)]; // avoid duplicates

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
  };

  const villagesMap = mockClassroomsStats
    .filter((village) => village.classroomCountryCode === selectedCountry)
    .map((village) => ({ name: village.villageName, id: village.villageId }));
  const villages = [...new Set(villagesMap)];

  const handleVillageChange = (village: { name: string; id: number }) => {
    setSelectedVillage(village);
  };
  // eslint-disable-next-line no-console
  console.log('Villages stats', villagesStats.data?.teacherCreatedAccountsNumber);
  return (
    <>
      <p>{selectedVillage?.id}</p>
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
          <StatsCard data={128}>Nombre de profs ayant créé des comptes famille</StatsCard>
          <StatsCard data={212}>Nombre de codes enfant créés</StatsCard>
          <StatsCard data={128}>Nombre de familles connectées</StatsCard>
        </div>
      )}
    </>
  );
};

export default VillageStats;
