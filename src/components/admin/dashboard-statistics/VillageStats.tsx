import React, { useEffect, useState } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Box, Tab, Tabs } from '@mui/material';

import { OneVillageTable } from '../OneVillageTable';
import TabPanel from './TabPanel';
import TeamComments from './TeamComments';
import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import ClassesContributionCard from './cards/ClassesContributionCard/ClassesContributionCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from './cards/StatsCard/StatsCard';
import BarCharts from './charts/BarCharts';
import DualBarChart from './charts/DualBarChart/DualBarChart';
import PieCharts from './charts/PieCharts';
import CountriesDropdown from './filters/CountriesDropdown';
import PhaseDropdown from './filters/PhaseDropdown';
import VillageDropdown from './filters/VillageDropdown';
import PhaseDetails from './menu/PhaseDetails';
import { mockDataByMonth } from './mocks/mocks';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import { createFamiliesWithoutAccountRows } from './utils/tableCreator';
import { FamiliesWithoutAccountHeaders } from './utils/tableHeader';
import { useGetVillagesStats } from 'src/api/statistics/statistics.get';
import { useCountries } from 'src/services/useCountries';
import { useStatisticsClassrooms, useStatisticsSessions } from 'src/services/useStatistics';
import { useVillages } from 'src/services/useVillages';
import type { ClassroomsStats, OneVillageTableRow, SessionsStats } from 'types/statistics.type';
import type { VillageFilter } from 'types/village.type';

const VillageStats = () => {
  const data = { data: [{ label: 'test1', id: 1, value: 1 }] };
  const EngagementBarChartTitle = 'Évolution des connexions';
  const [selectedCountry, setSelectedCountry] = useState<string>('FR');
  const [selectedVillage, setSelectedVillage] = useState<string>('');
  const [options, setOptions] = useState<VillageFilter>({ countryIsoCode: '' });
  const [value, setValue] = React.useState(0);
  const [selectedPhase, setSelectedPhase] = React.useState<number>(0);

  const { countries } = useCountries({ hasVillage: true });

  const { villages } = useVillages(options);
  const villagesStats = useGetVillagesStats(+selectedVillage, selectedPhase);
  const statisticsClassrooms = useStatisticsClassrooms(null, selectedCountry, null) as ClassroomsStats;
  const statisticsSessions: SessionsStats | Record<string, never> = useStatisticsSessions(Number(selectedVillage), selectedCountry, null);

  useEffect(() => {
    setOptions({
      countryIsoCode: selectedCountry,
    });
  }, [selectedCountry]);

  const [familiesWithoutAccountRows, setFamiliesWithoutAccountRows] = React.useState<Array<OneVillageTableRow>>([]);

  useEffect(() => {
    if (villagesStats.data?.family?.familiesWithoutAccount) {
      setFamiliesWithoutAccountRows(createFamiliesWithoutAccountRows(villagesStats.data.family.familiesWithoutAccount));
    }
  }, [villagesStats.data?.family?.familiesWithoutAccount]);

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

  const firstTable = {
    country: 'France',
    data: [
      { name: 'École A', value: 300 },
      { name: 'École B', value: 200 },
      { name: 'École C', value: 250 },
      { name: 'École D', value: 400 },
      { name: 'École E', value: 350 },
      { name: 'École F', value: 300 },
      { name: 'École G', value: 350 },
    ],
  };

  const secondTable = {
    country: 'Canada',
    data: [
      { name: 'École H', value: 150 },
      { name: 'École I', value: 250 },
      { name: 'École J', value: 200 },
      { name: 'École K', value: 350 },
      { name: 'École L', value: 300 },
      { name: 'École M', value: 150 },
      { name: 'École N', value: 180 },
    ],
  };

  return (
    <>
      <div className={styles.filtersContainer}>
        <div className={styles.smallFilter}>
          <PhaseDropdown onPhaseChange={handlePhaseChange} />
        </div>
        <div className={styles.medFilter}>
          <CountriesDropdown countries={countries} onCountryChange={handleCountryChange} />
        </div>
        <div className={styles.medFilter}>
          <VillageDropdown villages={villages} onVillageChange={handleVillageChange} />
        </div>
        <div className={styles.medFilter} />
      </div>
      <TeamComments />
      <DualBarChart firstTable={firstTable} secondTable={secondTable} />
      <Tabs value={value} onChange={handleTabChange} aria-label="basic tabs example" sx={{ py: 3 }}>
        <Tab label="En classe" />
        <Tab label="En famille" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <div className="statistic--container">
          <StatsCard data={statisticsSessions.registeredClassroomsCount ? statisticsSessions.registeredClassroomsCount : 0}>
            Nombre de classes inscrites
          </StatsCard>
          <StatsCard data={statisticsSessions.connectedClassroomsCount ? statisticsSessions.connectedClassroomsCount : 0}>
            Nombre de classes connectées
          </StatsCard>
          <StatsCard data={statisticsSessions.contributedClassroomsCount ? statisticsSessions.contributedClassroomsCount : 0}>
            Nombre de classes contributrices
          </StatsCard>
        </div>
        <div className="statistic__average--container">
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
        <div className="statistic__average--container">
          <PieCharts pieChartData={data}></PieCharts>
          <BarCharts dataByMonth={mockDataByMonth} title={EngagementBarChartTitle} />
        </div>
        <div className="statistic__average--container">
          <ClassesExchangesCard totalPublications={100} totalComments={100} totalVideos={100} />
          <ClassesContributionCard></ClassesContributionCard>
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
              <StatsCard data={villagesStats.data?.family?.familyAccountsCount}>Nombre de profs ayant créé des comptes famille</StatsCard>
              <StatsCard data={villagesStats.data?.family?.childrenCodesCount}>Nombre de codes enfant créés</StatsCard>
              <StatsCard data={villagesStats.data?.family?.connectedFamiliesCount}>Nombre de familles connectées</StatsCard>
            </Box>
          </>
        )}
      </TabPanel>
    </>
  );
};

export default VillageStats;
