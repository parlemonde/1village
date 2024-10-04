import React, { useState } from 'react';

import ClassroomDropdown from './filters/ClassroomDropdown';
import CountriesDropdown from './filters/CountriesDropdown';
import PhaseDropdown from './filters/PhaseDropdown';
import VillageDropdown from './filters/VillageDropdown';
import { mockClassroomsStats } from './mocks/mocks';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import { useCountries } from 'src/services/useCountries';
import { useVillages } from 'src/services/useVillages';
import type { VillageFilter } from 'types/village.type';

const ClassroomStats = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [selectedClassroom, setSelectedClassroom] = useState<string>();
  const [selectedPhase, setSelectedPhase] = useState<string>('4');
  const [options, setOptions] = useState<VillageFilter>({ countryIsoCode: '' });

  const pelicoMessage = 'Merci de sélectionner une classe pour analyser ses statistiques ';

  const { countries } = useCountries();
  const { villages } = useVillages(options);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedVillage('');
    setSelectedClassroom('');
  };

  React.useEffect(() => {
    setOptions({
      countryIsoCode: selectedCountry,
    });
  }, [selectedCountry, selectedPhase]);

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

  const handlePhaseChange = (phase: string) => {
    setSelectedPhase(phase);
  };

  return (
    <>
      <div className={styles.filtersContainer}>
        <div className={styles.phaseFilter}>
          <PhaseDropdown onPhaseChange={handlePhaseChange} />
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
