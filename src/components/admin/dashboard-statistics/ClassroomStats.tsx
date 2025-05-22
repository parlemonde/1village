import React, { useState } from 'react';

import { Box, Tab, Tabs } from '@mui/material';

import { OneVillageTable } from '../OneVillageTable';
import TabPanel from './TabPanel';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from './cards/StatsCard/StatsCard';
import ClassroomDropdown from './filters/ClassroomDropdown';
import CountriesDropdown from './filters/CountriesDropdown';
import PhaseDropdown from './filters/PhaseDropdown';
import VillageDropdown from './filters/VillageDropdown';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import { createFamiliesWithoutAccountRows } from './utils/tableCreator';
import { FamiliesWithoutAccountHeaders } from './utils/tableHeaders';
import { useGetMediatheque } from 'src/api/mediatheque/mediatheque.get';
import { useGetClassroomsStats } from 'src/api/statistics/statistics.get';
import { useClassrooms } from 'src/services/useClassrooms';
import { useCountries } from 'src/services/useCountries';
import { useVillages } from 'src/services/useVillages';
import type { Classroom, ClassroomFilter } from 'types/classroom.type';
import type { OneVillageTableRow } from 'types/statistics.type';
import type { VillageFilter } from 'types/village.type';

const ClassroomStats = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string>('4');
  const [villageFilter, setVillageFilter] = useState<VillageFilter>({ countryIsoCode: '' });
  const [classroomFilter, setClassroomFilter] = useState<ClassroomFilter>({ villageId: '' });
  const [value, setValue] = React.useState(0);

  const pelicoMessage = 'Merci de sélectionner une classe pour analyser ses statistiques ';

  const { countries } = useCountries();
  const { villages } = useVillages(villageFilter);
  const classroomsStats = useGetClassroomsStats(selectedClassroom?.id || 0, +selectedPhase);
  const { classrooms } = useClassrooms(classroomFilter);
  const mediatheque = useGetMediatheque();

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedVillage('');
    setSelectedClassroom(null);
  };

  React.useEffect(() => {
    setVillageFilter({
      countryIsoCode: selectedCountry,
    });
    setClassroomFilter({
      villageId: selectedVillage,
    });
  }, [selectedCountry, selectedPhase, selectedVillage]);

  const [familiesWithoutAccountRows, setFamiliesWithoutAccountRows] = React.useState<Array<OneVillageTableRow>>([]);
  React.useEffect(() => {
    if (classroomsStats.data?.familiesWithoutAccount) {
      setFamiliesWithoutAccountRows(createFamiliesWithoutAccountRows(classroomsStats.data?.familiesWithoutAccount));
    }
  }, [classroomsStats.data?.familiesWithoutAccount]);

  const handleVillageChange = (village: string) => {
    setSelectedVillage(village);
    setSelectedClassroom(null);
  };

  const handleClassroomChange = (classroom: Classroom) => {
    setSelectedClassroom(classroom);
  };

  const handlePhaseChange = (phase: string) => {
    setSelectedPhase(phase);
  };

  const noDataFoundMessage = 'Pas de données pour la classe sélectionnée';

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const classroomPublications = React.useMemo(() => {
    if (!mediatheque.data || !selectedClassroom || !selectedClassroom.user?.id) return 0;

    return mediatheque.data.filter((activity: any) => {
      // Make sure all the properties exist before comparing
      if (!activity || !activity.userId || !selectedClassroom?.user?.id) return false;
      return activity.userId === selectedClassroom.user.id && !!activity.displayAsUser && activity.user?.type === 3;
    }).length;
  }, [mediatheque.data, selectedClassroom]);

  return (
    <>
      <Box
        className={styles.filtersContainer}
        sx={{
          display: 'flex',
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
          gap: 2,
        }}
      >
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
      </Box>
      <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" sx={{ py: 3 }}>
        <Tab label="En classe" />
        <Tab label="En famille" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <p>Statistiques - En classe</p>
        {!selectedClassroom ? (
          <PelicoCard message={pelicoMessage} />
        ) : (
          <div className={styles.exchangesConnectionsContainer}>
            <ClassesExchangesCard totalPublications={classroomPublications} totalComments={0} totalVideos={0} />
          </div>
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {!selectedClassroom ? (
          <PelicoCard message={pelicoMessage} />
        ) : (
          <>
            <OneVillageTable
              admin={false}
              emptyPlaceholder={<p>{noDataFoundMessage}</p>}
              data={familiesWithoutAccountRows}
              columns={FamiliesWithoutAccountHeaders}
              titleContent={`À surveiller : comptes non créés (${familiesWithoutAccountRows.length})`}
            />
            <Box
              className={styles.classroomStats}
              sx={{
                display: 'flex',
                flexDirection: {
                  xs: 'column',
                  md: 'row',
                },
                gap: 2,
              }}
            >
              <StatsCard data={classroomsStats.data?.childrenCodesCount}>Nombre de codes enfant créés</StatsCard>
              <StatsCard data={classroomsStats.data?.connectedFamiliesCount}>Nombre de familles connectées</StatsCard>
            </Box>
          </>
        )}
      </TabPanel>
    </>
  );
};

export default ClassroomStats;
