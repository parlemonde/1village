import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { stat } from 'fs';
import React, { useContext, useState } from 'react';

import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import ClassesContributionCard from './cards/ClassesContributionCard/ClassesContributionCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import CommentCard from './cards/CommentCard/CommentCard';
import StatsCard from './cards/StatsCard/StatsCard';
import BarCharts from './charts/BarCharts';
import DashboardTable from './charts/DashboardTable';
import DualBarChart from './charts/DualBarChart/DualBarChart';
import PieCharts from './charts/PieCharts';
import CountriesDropdown from './filters/CountriesDropdown';
import PhaseDropdown from './filters/PhaseDropdown';
import PhaseDetails from './menu/PhaseDetails';
import { mockClassroomsStats, mockDataByMonth } from './mocks/mocks';
import styles from './styles/charts.module.css';
import { UserContext } from 'src/contexts/userContext';
import { useStatisticsClassrooms, useStatisticsSessions } from 'src/services/useStatistics';
import type { ClassroomsStats, SessionsStats } from 'types/statistics.type';

const VillageStats = () => {
  const data = { data: [{ label: 'test1', id: 1, value: 1 }] };
  const barChartData = [{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }];
  const EngagementBarChartTitle = 'Évolution des connexions';

  const { user } = useContext(UserContext);
  const statisticsSessions: SessionsStats | Record<string, never> = useStatisticsSessions(user?.villageId ?? 0);
  const statisticsClassrooms = useStatisticsClassrooms(null, 'FR', null) as ClassroomsStats;
  const [selectedCountry, setSelectedCountry] = useState<string>('');

  // const countriesMap = mockClassroomsStats.map((country) => country.classroomCountryCode);
  // const countries = [...new Set(countriesMap)]; // avoid duplicates
  // const handleCountryChange = (country: string) => {
  //   setSelectedCountry(country);
  // };

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
          <PhaseDropdown />
        </div>
        {/* <div className={styles.medFilter}>
          <CountriesDropdown countries={countries} onCountryChange={handleCountryChange} label={'Tous les pays'} />
        </div>
        <div className={styles.medFilter}>
          <CountriesDropdown countries={countries} onCountryChange={handleCountryChange} label={'Tous les pays'} />
        </div> */}
        <div className={styles.medFilter} />
      </div>
      <CommentCard />
      <DualBarChart firstTable={firstTable} secondTable={secondTable} />
      <DashboardTable />
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
    </>
  );
};

export default VillageStats;
