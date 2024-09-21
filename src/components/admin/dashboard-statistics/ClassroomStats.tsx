import React, { useState } from 'react';

import ClassroomDropdown from './filters/ClassroomDropdown';
import CountriesDropdown from './filters/CountriesDropdown';
import PhaseDropdown from './filters/PhaseDropdown';
import VillageDropdown from './filters/VillageDropdown';
import { mockClassroomsStats } from './mocks/mocks';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';

const ClassroomStats = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [selectedClassroom, setSelectedClassroom] = useState<string>();

  const pelicoMessage = 'Merci de sélectionner une classe pour analyser ses statistiques ';

  const countriesMap = mockClassroomsStats.map((country) => country.classroomCountryCode);
  const countries = [...new Set(countriesMap)];

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedVillage('');
    setSelectedClassroom('');
  };

  const villagesMap = mockClassroomsStats.filter((village) => village.classroomCountryCode === selectedCountry).map((village) => village.villageName);
  const villages = [...new Set(villagesMap)];

  const handleVillageChange = (village: string) => {
    setSelectedVillage(village);
    setSelectedClassroom('');
  };

  const classroomsMap = mockClassroomsStats
    .filter((classroom) => classroom.villageName === selectedVillage)
    .map((classroom) => classroom.classroomId);
  const classrooms = [...new Set(classroomsMap)];

  const handleClassroomChange = (classroom: string) => {
    setSelectedClassroom(classroom);
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
        <div className={styles.countryFilter}>
          <ClassroomDropdown classrooms={classrooms} onClassroomChange={handleClassroomChange} />
        </div>
      </div>
      {!selectedClassroom ? <PelicoCard message={pelicoMessage} /> : null}
    </>
  );
};

export default ClassroomStats;
