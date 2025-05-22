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
import VillageListCard from './cards/VillageListCard/VillageListCard';
import BarCharts from './charts/BarCharts';
import HorizontalBars from './charts/HorizontalChart';
import PieCharts from './charts/PieCharts';
import CountriesDropdown from './filters/CountriesDropdown';
import PhaseDropdown from './filters/PhaseDropdown';
import PhaseDetails from './menu/PhaseDetails';
import { mockDataByMonth } from './mocks/mocks';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import { sumContribution } from './utils/sumData';
import { createFamiliesWithoutAccountRows, createFloatingAccountsRows } from './utils/tableCreator';
import { FamiliesWithoutAccountHeaders, FloatingAccountsHeaders } from './utils/tableHeaders';
import { useGetCountriesStats } from 'src/api/statistics/statistics.get';
import { useCountries } from 'src/services/useCountries';
import { useStatisticsClassrooms, useStatisticsSessions } from 'src/services/useStatistics';
import type { OneVillageTableRow, ClassroomsStats, SessionsStats } from 'types/statistics.type';

const pieChartData = {
  data: [
    { id: 0, value: 10, label: 'series A' },
    { id: 1, value: 15, label: 'series B' },
    { id: 2, value: 20, label: 'series C' },
  ],
};

const EngagementBarChartTitle = 'Évolution des connexions';
const ContributionBarChartTitle = 'Contribution des classes';

const CountryStats = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedPhase, setSelectedPhase] = React.useState<number>(0);
  const [value, setValue] = React.useState(0);
  const pelicoMessage = 'Merci de sélectionner un pays pour analyser ses statistiques ';
  const noDataFoundMessage = 'Pas de données pour le Pays sélectionné';
  const statisticsClassrooms = useStatisticsClassrooms(null, selectedCountry, null) as ClassroomsStats;
  const statisticsSessions: SessionsStats | Record<string, never> = useStatisticsSessions(null, selectedCountry, null);

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

  const handlePhaseChange = (phase: string) => {
    setSelectedPhase(+phase);
  };

  const countryData = sumContribution[selectedCountry];
  const { totalActivities = 0, totalComments = 0, totalVideos = 0 } = countryData || {};

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
              <HorizontalBars highlightCountry="FR"></HorizontalBars>
            </div>
            {/* <Box
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
            </Box> */}
            <VillageListCard></VillageListCard>
            {/* <div className={styles.monitorTable}>
            <DashboardTable />
          </div> */}
            <div className={styles.classroomStats}>
              <StatsCard data={statisticsSessions.registeredClassroomsCount ? statisticsSessions.registeredClassroomsCount : 0}>
                Nombre de classes inscrites
              </StatsCard>
              <StatsCard data={statisticsSessions.connectedClassroomsCount ? statisticsSessions.connectedClassroomsCount : 0}>
                Nombre de classes connectées
              </StatsCard>
              <StatsCard data={statisticsSessions.contribuedClassroomsCount ? statisticsSessions.contribuedClassroomsCount : 0}>
                Nombre de classes contributrices
              </StatsCard>
            </div>
            <div className={styles.averageStatsContainer}>
              <AverageStatsCard
                data={{
                  min: statisticsSessions.minDuration ? Math.floor(statisticsSessions.minDuration / 60) : 0,
                  max: statisticsSessions.maxDuration ? Math.floor(statisticsSessions.maxDuration / 60) : 0,
                  average: statisticsSessions.averageDuration ? Math.floor(statisticsSessions.averageDuration / 60) : 0,
                  median: statisticsSessions.medianDuration ? Math.floor(statisticsSessions.medianDuration / 60) : 0,
                }}
                unit="min"
                icon={<AccessTimeIcon sx={{ fontSize: 'inherit' }} />}
              >
                Temps de connexion moyen par classe
              </AverageStatsCard>
              <AverageStatsCard
                data={{
                  min: statisticsSessions.minConnections ? statisticsSessions.minConnections : 0,
                  max: statisticsSessions.maxConnections ? statisticsSessions.maxConnections : 0,
                  average: statisticsSessions.averageConnections ? statisticsSessions.averageConnections : 0,
                  median: statisticsSessions.medianConnections ? statisticsSessions.medianConnections : 0,
                }}
                icon={<VisibilityIcon sx={{ fontSize: 'inherit' }} />}
              >
                Nombre de connexions moyen par classe
              </AverageStatsCard>
            </div>
            <div className={styles.engagementContainer}>
              <PieCharts className={styles.minContainer} pieChartData={pieChartData} />
              <BarCharts className={styles.midContainer} dataByMonth={mockDataByMonth} title={EngagementBarChartTitle} />
            </div>
            <div className={styles.exchangesConnectionsContainer}>
              <ClassesExchangesCard totalPublications={totalActivities} totalComments={totalComments} totalVideos={totalVideos} />
              <BarCharts dataByMonth={mockDataByMonth} title={ContributionBarChartTitle} />
            </div>
            {statisticsClassrooms && statisticsClassrooms.phases && (
              <div className="statistic__phase--container">
                <div>
                  <PhaseDetails phase={1} data={statisticsClassrooms.phases[0].data} />
                </div>
                <div className="statistic__phase">
                  <PhaseDetails phase={2} data={statisticsClassrooms.phases[1].data} />
                </div>
                <div className="statistic__phase">
                  <PhaseDetails phase={3} data={statisticsClassrooms.phases[1].data} />
                </div>
              </div>
            )}
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
