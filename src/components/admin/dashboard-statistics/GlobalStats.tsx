import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import React from 'react';

import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import ClassesContributionCard from './cards/ClassesContributionCard/ClassesContributionCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import CommentCard from './cards/CommentCard/CommentCard';
import StatsCard from './cards/StatsCard/StatsCard';
import BarCharts from './charts/BarCharts';
import PhaseDropdown from './filters/PhaseDropdown';
import DashboardWorldMap from './map/DashboardWorldMap/DashboardWorldMap';
import PhaseDetails from './menu/PhaseDetails';
import { mockDataByMonth } from './mocks/mocks';
// import { useGetSessionsStats } from 'src/api/statistics/statistics.get';
import styles from './styles/charts.module.css';
import { useStatisticsClassrooms, useStatisticsSessions } from 'src/services/useStatistics';
import type { ClassroomsStats, SessionsStats } from 'types/statistics.type';

const BarChartTitle = 'Evolution des connexions';

const GlobalStats = () => {
  // const sessionsStats = useGetSessionsStats();
  const statisticsClassrooms = useStatisticsClassrooms(null, 'FR', null) as ClassroomsStats;

  const statisticsSessions: SessionsStats | Record<string, never> = useStatisticsSessions(null, null, null);
  // if (sessionsStats.isError) return <p>Error!</p>;
  // if (sessionsStats.isLoading || sessionsStats.isIdle) return <p>Loading...</p>;

  return (
    <>
      <div className={styles.filtersContainer}>
        <div className={styles.smallFilter}>
          <PhaseDropdown />
        </div>
        <div className={styles.medFilter} />
        <div className={styles.medFilter} />
        <div className={styles.medFilter} />
      </div>
      <CommentCard />
      <DashboardWorldMap />

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
      <div className="statistic--container">
        <BarCharts dataByMonth={mockDataByMonth} title={BarChartTitle} />
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

export default GlobalStats;
