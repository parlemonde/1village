import React from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';

import TeamComments from './TeamComments';
import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from './cards/StatsCard/StatsCard';
import DashboardWorldMap from './map/DashboardWorldMap/DashboardWorldMap';
import PhaseDetails from './menu/PhaseDetails';
import { useGetClassroomsStats, useGetConnectionsStats } from 'src/api/statistics/statistics.get';

const GlobalStats = () => {
  const classroomsStats = useGetClassroomsStats();
  const connectionsStats = useGetConnectionsStats();

  if (classroomsStats.isError) return <p>Error!</p>;
  if (classroomsStats.isLoading || classroomsStats.isIdle) return <p>Loading...</p>;

  if (connectionsStats.isError) return <p>Error!</p>;
  if (connectionsStats.isLoading || connectionsStats.isIdle) return <p>Loading...</p>;

  return (
    <>
      <TeamComments />
      <DashboardWorldMap />
      <div>
        <StatsCard data={connectionsStats.data.registeredClassroomsCount}>Nombre de classes inscrites</StatsCard>
        <StatsCard data={connectionsStats.data.connectedClassroomsCount}>Nombre de classes connectées</StatsCard>
        <StatsCard data={connectionsStats.data.contributedClassroomsCount}>Nombre de classes contributrices</StatsCard>
      </div>
      <div>
        <AverageStatsCard
          data={{
            min: Math.floor(connectionsStats.data.minDuration / 60),
            max: Math.floor(connectionsStats.data.maxDuration / 60),
            average: Math.floor(connectionsStats.data.averageDuration / 60),
            median: Math.floor(connectionsStats.data.medianDuration / 60),
          }}
          unit="min"
          icon={<AccessTimeIcon sx={{ fontSize: 'inherit' }} />}
        >
          Temps de connexion moyen par classe
        </AverageStatsCard>
        <AverageStatsCard
          data={{
            min: connectionsStats.data.minConnections,
            max: connectionsStats.data.maxConnections,
            average: connectionsStats.data.averageConnections,
            median: connectionsStats.data.medianConnections,
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
