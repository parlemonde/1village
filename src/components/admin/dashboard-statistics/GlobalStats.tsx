import React from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';

import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from './cards/StatsCard/StatsCard';
import DashboardWorldMap from './map/DashboardWorldMap/DashboardWorldMap';
import PhaseDetails from './menu/PhaseDetails';
import { useGetSessionsStats } from 'src/api/statistics/statistics.get';

const GlobalStats = () => {
  const sessionsStats = useGetSessionsStats();

  if (sessionsStats.isError) return <p>Error!</p>;
  if (sessionsStats.isLoading || sessionsStats.isIdle) return <p>Loading...</p>;

  return (
    <>
      <DashboardWorldMap />
      <div>
        <StatsCard data={10}>Nombre de classes inscrites</StatsCard>
        <StatsCard data={10}>Nombre de classes connectées</StatsCard>
        <StatsCard data={10}>Nombre de classes contributrices</StatsCard>
      </div>
      <div>
        <AverageStatsCard
          data={{
            min: Math.floor(sessionsStats.data.minDuration / 60),
            max: Math.floor(sessionsStats.data.maxDuration / 60),
            average: Math.floor(sessionsStats.data.averageDuration / 60),
            median: Math.floor(sessionsStats.data.medianDuration / 60),
          }}
          unit="min"
          icon={<AccessTimeIcon sx={{ fontSize: 'inherit' }} />}
        >
          Temps de connexion moyen par classe
        </AverageStatsCard>
        <AverageStatsCard
          data={{
            min: sessionsStats.data.minConnections,
            max: sessionsStats.data.maxConnections,
            average: sessionsStats.data.averageConnections,
            median: sessionsStats.data.medianConnections,
          }}
          icon={<VisibilityIcon sx={{ fontSize: 'inherit' }} />}
        >
          Nombre de connexions moyen par classe
        </AverageStatsCard>
      </div>
      <div>
        <ClassesExchangesCard totalPublications={100} totalComments={100} totalVideos={100} />
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

export default GlobalStats;
