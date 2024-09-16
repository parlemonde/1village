import React, { useState } from 'react';

import CountriesDropdown from './filters/CountriesDropdown';
import PhaseDropdown from './filters/PhaseDropdown';
import VillageDropdown from './filters/VillageDropdown';
import { mockClassroomsStats } from './mocks/mocks';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';

const VillageStats = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedVillage, setSelectedVillage] = useState<string>('');

  const pelicoMessage = 'Merci de sélectionner un village-monde pour analyser ses statistiques ';

  const countriesMap = mockClassroomsStats.map((country) => country.classroomCountryCode);
  const countries = [...new Set(countriesMap)]; // avoid duplicates

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
  };

  const villagesMap = mockClassroomsStats.filter((village) => village.classroomCountryCode === selectedCountry).map((village) => village.villageName);
  const villages = [...new Set(villagesMap)];

  const handleVillageChange = (village: string) => {
    setSelectedVillage(village);
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
      {!selectedVillage ? <PelicoCard message={pelicoMessage} /> : null}
    </>
  );
};

export default VillageStats;
