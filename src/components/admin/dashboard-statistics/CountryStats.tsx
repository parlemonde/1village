import React, { useState } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Tab, Tabs } from '@mui/material';
import Box from '@mui/material/Box';

import { OneVillageTable } from '../OneVillageTable';
import TabPanel from './TabPanel';
import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from './cards/StatsCard/StatsCard';
import BarCharts from './charts/BarCharts';
import HorizontalBars from './charts/HorizontalChart';
import PieCharts from './charts/PieCharts';
import CountriesDropdown from './filters/CountriesDropdown';
import PhaseDropdown from './filters/PhaseDropdown';
import PhaseDetails from './menu/PhaseDetails';
import { mockClassroomsStats, mockConnectionsStats } from './mocks/mocks';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import { sumContribution } from './utils/sumData';
import { createFamiliesWithoutAccountRows, createFloatingAccountsRows } from './utils/tableCreator';
import { FamiliesWithoutAccountHeaders, FloatingAccountsHeaders } from './utils/tableHeaders';
import { useGetCountriesStats } from 'src/api/statistics/statistics.get';
import { useCountries } from 'src/services/useCountries';
import type { OneVillageTableRow } from 'types/statistics.type';

const pieChartData = {
  data: [
    { id: 0, value: 10, label: 'series A' },
    { id: 1, value: 15, label: 'series B' },
    { id: 2, value: 20, label: 'series C' },
  ],
};

const barChartData = [{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }];
const EngagementBarChartTitle = 'Évolution des connexions';
const ContributionBarChartTitle = 'Contribution des classes';

const CountryStats = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedPhase, setSelectedPhase] = React.useState<number>(0);
  const [value, setValue] = React.useState(0);
  const pelicoMessage = 'Merci de sélectionner un pays pour analyser ses statistiques ';
  const noDataFoundMessage = 'Pas de données pour le Pays sélectionné';
  const { countries } = useCountries();
  const countriesStats = useGetCountriesStats(selectedCountry, selectedPhase);

  const [familiesWithoutAccountRows, setFamiliesWithoutAccountRows] = React.useState<Array<OneVillageTableRow>>([]);
  const [floatingAccountsRows, setFloatingAccountsRows] = React.useState<Array<OneVillageTableRow>>([]);
  React.useEffect(() => {
    if (countriesStats.data?.familiesWithoutAccount) {
      setFamiliesWithoutAccountRows(createFamiliesWithoutAccountRows(countriesStats.data?.familiesWithoutAccount));
    }
    if (countriesStats.data?.floatingAccounts) {
      setFloatingAccountsRows([]);
      setFloatingAccountsRows(createFloatingAccountsRows(countriesStats.data?.floatingAccounts));
    }
  }, [countriesStats.data?.familiesWithoutAccount, countriesStats.data?.floatingAccounts]);

  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const filteredVillage = mockClassroomsStats.filter((village) => village.classroomCountryCode === selectedCountry);
  const countryData = sumContribution[selectedCountry];

  const { totalActivities = 0, totalComments = 0, totalVideos = 0 } = countryData || {};

  const classStats = mockConnectionsStats.map((classroom) => ({
    registered: classroom.registeredClassroomsCount,
    connected: classroom.connectedClassroomsCount,
    contributed: classroom.contributedClassroomsCount,
  }));

  const connectStats = mockConnectionsStats.map((connect) => ({
    averageConnection: connect.averageConnections,
    averageDuration: connect.averageDuration,
    minDuration: connect.minDuration,
    maxDuration: connect.maxDuration,
    medianDuration: connect.medianDuration,
    minConnections: connect.minConnections,
    maxConnections: connect.maxConnections,
    medianConnections: connect.medianConnections,
  }));

  const handlePhaseChange = (phase: string) => {
    setSelectedPhase(+phase);
  };

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
      </Box>
      <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" sx={{ py: 3 }}>
        <Tab label="En classe" />
        <Tab label="En famille" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <h1>Statut: Observateur</h1>
        {!selectedCountry ? (
          <PelicoCard message={pelicoMessage} />
        ) : (
          <>
            <div className={styles.monitorTable}>
              <HorizontalBars />
            </div>
            <Box
              height={1}
              width={1}
              my={4}
              display="flex"
              alignItems="center"
              justify-content="center"
              font-weight="bold"
              gap={4}
              p={2}
              py={3}
              sx={{ border: '2px solid #4C3ED9', borderRadius: 4 }}
            >
              Ce pays participe dans les villages-monde suivants :
              <ul>
                {filteredVillage.map((village, index) => (
                  <li key={index}>{village.villageName}</li>
                ))}
              </ul>
            </Box>
            {/* <div className={styles.monitorTable}>
            <DashboardTable />
          </div> */}
            <div className={styles.classroomStats}>
              <StatsCard data={classStats[0].registered}>Nombre de classes inscrites</StatsCard>
              <StatsCard data={classStats[0].connected}>Nombre de classes connectées</StatsCard>
              <StatsCard data={classStats[0].contributed}>Nombre de classes contributrices</StatsCard>
            </div>
            <div className={styles.averageStatsContainer}>
              <AverageStatsCard
                data={{
                  min: connectStats[0].minConnections,
                  max: connectStats[0].maxConnections,
                  average: connectStats[0].averageConnection,
                  median: connectStats[0].medianConnections,
                }}
                unit="min"
                icon={<AccessTimeIcon sx={{ fontSize: 'inherit' }} />}
              >
                Temps de connexion moyen par classe
              </AverageStatsCard>
              <AverageStatsCard
                data={{
                  min: connectStats[0].minDuration,
                  max: connectStats[0].maxDuration,
                  average: connectStats[0].averageDuration,
                  median: connectStats[0].medianDuration,
                }}
                icon={<VisibilityIcon sx={{ fontSize: 'inherit' }} />}
              >
                Nombre de connexions moyen par classe
              </AverageStatsCard>
            </div>
            <div className={styles.engagementContainer}>
              <PieCharts pieChartData={pieChartData} />
              <BarCharts barChartData={barChartData} title={EngagementBarChartTitle} />
            </div>
            <div className={styles.exchangesConnectionsContainer}>
              <ClassesExchangesCard totalPublications={totalActivities} totalComments={totalComments} totalVideos={totalVideos} />
              <BarCharts className={styles.connectionsChart} barChartData={barChartData} title={ContributionBarChartTitle} />
            </div>
            <div>
              <PhaseDetails
                phase={1}
                data={[
                  { name: 'test', connections: 2 },
                  { name: 'test 2', connections: 12 },
                ]}
              />
            </div>
            <div>
              <PhaseDetails
                phase={2}
                data={[
                  { name: 'test', connections: 2, allo: 'fds' },
                  { name: 'dest 2', connections: 12, allo: 'ads' },
                ]}
              />
            </div>
            <div>
              <PhaseDetails
                phase={3}
                data={[
                  { name: 'test ff', connections: 15, allo: 'fdjjjjjjjs' },
                  { name: 'dest 2', connections: 1, allo: 'fdsfsqds' },
                ]}
              />
            </div>
          </>
        )}
      </TabPanel>
      <TabPanel value={value} index={1}>
        {!selectedCountry ? (
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
            <OneVillageTable
              admin={false}
              emptyPlaceholder={<p>{'Pas de données'}</p>}
              data={floatingAccountsRows}
              columns={FloatingAccountsHeaders}
              titleContent={`À surveiller : comptes flottants (${floatingAccountsRows.length})`}
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
              <StatsCard data={countriesStats.data?.familyAccountsCount}>Nombre de profs ayant créé des comptes famille</StatsCard>
              <StatsCard data={countriesStats.data?.childrenCodesCount}>Nombre de codes enfant créés</StatsCard>
              <StatsCard data={countriesStats.data?.connectedFamiliesCount}>Nombre de familles connectées</StatsCard>
            </Box>
          </>
        )}
      </TabPanel>
    </>
  );
};

export default CountryStats;
