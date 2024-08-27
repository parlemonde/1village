import React, { useState } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Box from '@mui/material/Box';

import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import StatsCard from './cards/StatsCard/StatsCard';
import BarCharts from './charts/BarCharts';
import DashboardTable from './charts/DashboardTable';
import HorizontalBars from './charts/HorizontalChart'; // Correction ici, utilisation de HorizontalBars
import PieCharts from './charts/PieCharts';
import CountriesDropdown from './filters/CountriesDropdown';
import PhaseDropdown from './filters/PhaseDropdown';
import PhaseDetails from './menu/PhaseDetails';
import { mockClassroomsStats, mockConnectionsStats } from './mocks/mocks';
import styles from './styles/charts.module.css';

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

  const countriesMap = mockClassroomsStats.map((country) => country.classroomCountryCode);
  const countries = [...new Set(countriesMap)]; // avoid duplicates
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
  };

  const filteredVillage = mockClassroomsStats.filter((village) => village.classroomCountryCode === selectedCountry);

  return (
    <>
      <div className={styles.filtersContainer}>
        <div className={styles.phaseFilter}>
          <PhaseDropdown />
        </div>
        <div className={styles.countryFilter}>
          <CountriesDropdown countries={countries} onCountryChange={handleCountryChange} />
        </div>
      </div>
      <h1>Statut: Observateur</h1>
      <div className={styles.monitorTable}>
        <HorizontalBars /> {/* Passer selectedCountry */}
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
      <div className={styles.monitorTable}>
        <DashboardTable />
      </div>
      <div className={styles.classroomStats}>
        <StatsCard data={10}>Nombre de classes inscrites</StatsCard>
        <StatsCard data={10}>Nombre de classes connectées</StatsCard>
        <StatsCard data={10}>Nombre de classes contributrices</StatsCard>
      </div>
      <div className={styles.averageStatsContainer}>
        <AverageStatsCard data={{ min: 1, max: 20, average: 15, median: 5 }} unit="min" icon={<AccessTimeIcon sx={{ fontSize: 'inherit' }} />}>
          Temps de connexion moyen par classe
        </AverageStatsCard>
        <AverageStatsCard data={{ min: 1, max: 20, average: 15, median: 5 }} icon={<VisibilityIcon sx={{ fontSize: 'inherit' }} />}>
          Nombre de connexions moyen par classe
        </AverageStatsCard>
      </div>
      <div className={styles.engagementContainer}>
        <PieCharts pieChartData={pieChartData} />
        <BarCharts barChartData={barChartData} title={EngagementBarChartTitle} />
      </div>
      <div className={styles.exchangesConnectionsContainer}>
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
  );
};

export default CountryStats;
