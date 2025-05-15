import React, { useState } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';

import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from './cards/StatsCard/StatsCard';
import VillageListCard from './cards/VillageListCard/VillageListCard';
import BarCharts from './charts/BarCharts';
import HorizontalBarsChart from './charts/HorizontalChart';
import PieCharts from './charts/PieCharts';
import CountriesDropdown from './filters/CountriesDropdown';
// import PhaseDropdown from './filters/PhaseDropdown';
import PhaseDetails from './menu/PhaseDetails';
import { mockDataByMonth } from './mocks/mocks';
import { PelicoCard } from './pelico-card';
import styles from './styles/charts.module.css';
import { useCountries } from 'src/services/useCountries';
import { useStatisticsClassrooms, useStatisticsSessions } from 'src/services/useStatistics';
import type { ClassroomsStats, SessionsStats } from 'types/statistics.type';

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
  // const [selectedPhase, setSelectedPhase] = useState<number>(0);
  const pelicoMessage = 'Merci de sélectionner un pays pour analyser ses statistiques ';
  const statisticsClassrooms = useStatisticsClassrooms(null, selectedCountry, null) as ClassroomsStats;
  const statisticsSessions: SessionsStats | Record<string, never> = useStatisticsSessions(null, selectedCountry, null);

  const { countries } = useCountries();
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
  };

  // const handlePhaseChange = (phase: string) => {
  //   setSelectedPhase(+phase);
  // };

  return (
    <>
      <div className={styles.filtersContainer}>
        <div className={styles.smallFilter}>{/* <PhaseDropdown onPhaseChange={handlePhaseChange} /> */}</div>
        <div className={styles.medFilter}>
          <CountriesDropdown countries={countries} onCountryChange={handleCountryChange} />
        </div>
        <div className={styles.medFilter} />
        <div className={styles.medFilter} />
      </div>
      {!selectedCountry ? (
        <PelicoCard message={pelicoMessage} />
      ) : (
        <>
          <div className={styles.simpleContainer}>
            <HorizontalBarsChart highlightCountry="FR"></HorizontalBarsChart>
          </div>
          <VillageListCard></VillageListCard>
          {/* <div className={styles.monitorTable}>
            <DashboardTable data={undefined} />
          </div> */}
          <div className="statistic--container">
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
            <PieCharts className={styles.minContainer} pieChartData={pieChartData} />
            <BarCharts className={styles.midContainer} dataByMonth={mockDataByMonth} title={EngagementBarChartTitle} />
          </div>
          <div className="statistic__average--container">
            <ClassesExchangesCard totalPublications={100} totalComments={100} totalVideos={100} />
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
    </>
  );
};

export default CountryStats;
