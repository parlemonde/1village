import React, { useState } from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';

import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import ClassroomDetailsCard from './cards/ClassroomDetailsCard/ClassroomDetailsCard';
import CommentCard from './cards/CommentCard/CommentCard';
import BarCharts from './charts/BarCharts';
import CountriesDropdown from './filters/CountriesDropdown';
import PhaseDropdown from './filters/PhaseDropdown';
import PhaseDetails from './menu/PhaseDetails';
import { mockClassroomsStats, mockDataByMonth } from './mocks/mocks';
import styles from './styles/charts.module.css';
import { useStatisticsClassrooms, useStatisticsSessions } from 'src/services/useStatistics';
import type { ClassroomsStats, SessionsStats } from 'types/statistics.type';

const barChartData = [{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }];
const BarChartTitle = 'Evolution des connexions';

const ClassroomStats = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const statisticsSessions: SessionsStats | Record<string, never> = useStatisticsSessions(null, null, 1);
  const statisticsClassrooms = useStatisticsClassrooms(null, 'FR', null) as ClassroomsStats;
  const countriesMap = mockClassroomsStats.map((country) => country.classroomCountryCode);
  const countries = [...new Set(countriesMap)]; // avoid duplicates
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
  };

  return (
    <>
      <div className={styles.filtersContainer}>
        <div className={styles.smallFilter}>
          <PhaseDropdown />
        </div>
        <div className={styles.medFilter}>
          <CountriesDropdown countries={countries} onCountryChange={handleCountryChange} label={'Tous les pays'} />
        </div>
        <div className={styles.medFilter}>
          <CountriesDropdown countries={countries} onCountryChange={handleCountryChange} label={'Tous les pays'} />
        </div>
        <div className={styles.medFilter}>
          <CountriesDropdown countries={countries} onCountryChange={handleCountryChange} label={'Tous les pays'} />
        </div>
      </div>
      <CommentCard />
      <ClassroomDetailsCard />
      {/* <DashboardTabs></DashboardTabs> */}
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
      <div className="statistic--container">
        <BarCharts dataByMonth={mockDataByMonth} title={BarChartTitle} />
      </div>
      <div className="statistic__average--container">
        <ClassesExchangesCard totalPublications={100} totalComments={100} totalVideos={100} />
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

export default ClassroomStats;
