import React, { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

import { OneVillageTable } from '../OneVillageTable';
import StatsCard from './cards/StatsCard/StatsCard';
import CountriesDropdown from './filters/CountriesDropdown';
import VillageDropdown from './filters/VillageDropdown';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import { useGetVillagesStats } from 'src/api/statistics/statistics.get';
import { useCountries } from 'src/services/useCountries';
import { useVillages } from 'src/services/useVillages';
import type { VillageFilter } from 'types/village.type';

const VillageStats = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [options, setOptions] = useState<VillageFilter>({ countryIsoCode: '' });

  const pelicoMessage = 'Merci de sélectionner un village-monde pour analyser ses statistiques ';

  const { countries } = useCountries();

  const { villages } = useVillages(options);
  const villagesStats = useGetVillagesStats(+selectedVillage);
  React.useEffect(() => {
    setOptions({
      countryIsoCode: selectedCountry,
    });
  }, [selectedCountry]);

  const [rows, setRows] = React.useState<Array<{ id: string | number; [key: string]: string | boolean | number | React.ReactNode }>>([]);
  React.useEffect(() => {
    if (villagesStats.data?.familiesWithoutAccount) {
      setRows([]);
      setRows(createRows(villagesStats.data?.familiesWithoutAccount));
    }
  }, [villagesStats.data?.familiesWithoutAccount]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
    setSelectedVillage('');
  };

  const handleVillageChange = (village: string) => {
    setSelectedVillage(village);
  };

  interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
  const [value, setValue] = React.useState(0);
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  const FamiliesWithoutAccountHeaders = [
    { key: 'student', label: 'Nom Prénom Enfant', sortable: true },
    { key: 'vm', label: 'Village-Monde', sortable: true },
    { key: 'classroom', label: 'Classe', sortable: true },
    { key: 'country', label: 'Pays', sortable: true },
    { key: 'creationDate', label: 'Date de création identifiant', sortable: true },
  ];
  function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
        {value === index && (
          <Box sx={{ p: 0 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  function createRows(
    data: Array<{
      student_id: string | number;
      student_firstname: string;
      student_lastname: string;
      village_name: string;
      classroom_name: string;
      classroom_country: string;
    }>,
  ): Array<{ id: string | number; [key: string]: string | boolean | number | React.ReactNode }> {
    return data.map((row) => {
      return {
        id: row.student_id, // id is string | number
        student: `${row.student_firstname} ${row.student_lastname}`, // string
        vm: row.village_name, // string
        classroom: row.classroom_name, // string
        country: row.classroom_country, // string
        creationDate: 'À venir', // string
      };
    });
  }
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
          <CountriesDropdown countries={countries} onCountryChange={handleCountryChange} />
        </div>
        <div className={styles.countryFilter}>
          <VillageDropdown villages={villages} onVillageChange={handleVillageChange} />
        </div>
      </Box>
      <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" sx={{ py: 3 }}>
        <Tab label="En classe" {...a11yProps(0)} />
        <Tab label="En famille" {...a11yProps(1)} />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        <p>Statistiques - En classe</p>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {!selectedVillage ? (
          <PelicoCard message={pelicoMessage} />
        ) : (
          <>
            <OneVillageTable
              admin={false}
              emptyPlaceholder={<p>{pelicoMessage}</p>}
              data={rows}
              columns={FamiliesWithoutAccountHeaders}
              titleContent={`À surveiller : comptes non créés (${rows.length})`}
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
      </CustomTabPanel>
    </>
  );
};

export default VillageStats;
