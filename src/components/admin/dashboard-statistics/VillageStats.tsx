import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { OneVillageTable } from '../OneVillageTable';
import TabPanel from './TabPanel';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from './cards/StatsCard/StatsCard';
import CountriesDropdown from './filters/CountriesDropdown';
import PhaseDropdown from './filters/PhaseDropdown';
import VillageDropdown from './filters/VillageDropdown';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import { createFamiliesWithoutAccountRows } from './utils/tableCreator';
import { FamiliesWithoutAccountHeaders } from './utils/tableHeaders';
import { useGetMediatheque } from 'src/api/mediatheque/mediatheque.get';
import { useGetVillagesStats } from 'src/api/statistics/statistics.get';
import { useCountries } from 'src/services/useCountries';
import { useVillages } from 'src/services/useVillages';
import type { OneVillageTableRow } from 'types/statistics.type';
import type { VillageFilter } from 'types/village.type';

const VillageStats = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [options, setOptions] = useState<VillageFilter>({ countryIsoCode: '' });
  const [value, setValue] = React.useState(0);
  const [selectedPhase, setSelectedPhase] = React.useState<number>(0);

  const { countries } = useCountries();

  const { villages } = useVillages(options);
  const villagesStats = useGetVillagesStats(+selectedVillage, selectedPhase);
  const mediatheque = useGetMediatheque();

  // Update options when selectedCountry changes
  React.useEffect(() => {
    setOptions({ countryIsoCode: selectedCountry });
  }, [selectedCountry]);

  const [familiesWithoutAccountRows, setFamiliesWithoutAccountRows] = React.useState<Array<OneVillageTableRow>>([]);
  React.useEffect(() => {
    if (villagesStats.data?.familiesWithoutAccount) {
      setFamiliesWithoutAccountRows(createFamiliesWithoutAccountRows(villagesStats.data?.familiesWithoutAccount));
    }
  }, [villagesStats.data?.familiesWithoutAccount]);

  const villagePublications = React.useMemo(() => {
    if (!mediatheque.data || !selectedVillage) return 0;
    return mediatheque.data.filter(
      (activity: any) => activity.villageId === parseInt(selectedVillage) && !!activity.displayAsUser && activity.user.type === 3,
    ).length;
  }, [mediatheque.data, selectedVillage]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedVillage('');
  };

  const handleVillageChange = (village: string) => {
    setSelectedVillage(village);
  };

  const handlePhaseChange = (phase: string) => {
    setSelectedPhase(+phase);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const pelicoMessage = 'Merci de sélectionner un village-monde pour analyser ses statistiques ';
  const noDataFoundMessage = 'Pas de données pour le Village-Monde sélectionné';
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
        <div className={styles.countryFilter}>
          <PhaseDropdown onPhaseChange={handlePhaseChange} />
        </div>
        <div className={styles.countryFilter}>
          <CountriesDropdown countries={countries} onCountryChange={handleCountryChange} />
        </div>
        <div className={styles.countryFilter}>
          <VillageDropdown villages={villages} onVillageChange={handleVillageChange} />
        </div>
      </Box>
      <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" sx={{ py: 3 }}>
        <Tab label="En classe" />
        <Tab label="En famille" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <p>Statistiques - En classe</p>
        {!selectedVillage ? (
          <PelicoCard message={pelicoMessage} />
        ) : (
          <div className={styles.exchangesConnectionsContainer}>
            <ClassesExchangesCard totalPublications={villagePublications} totalComments={0} totalVideos={0} />
          </div>
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {!selectedVillage ? (
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
              <StatsCard data={villagesStats.data?.familyAccountsCount}>Nombre de profs ayant créé des comptes famille</StatsCard>
              <StatsCard data={villagesStats.data?.childrenCodesCount}>Nombre de codes enfant créés</StatsCard>
              <StatsCard data={villagesStats.data?.connectedFamiliesCount}>Nombre de familles connectées</StatsCard>
            </Box>
          </>
        )}
      </TabPanel>
    </>
  );
};

export default VillageStats;
