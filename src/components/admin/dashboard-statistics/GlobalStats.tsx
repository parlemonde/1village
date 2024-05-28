import React from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';

import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from './cards/StatsCard/StatsCard';
import { useGetClassroomExchanges, useGetConnectionTimes, useGetConnectionCounts } from 'src/api/statistics/statistics.get';

const GlobalStats = () => {
  const classroomExchanges = useGetClassroomExchanges();
  const connectionTimes = useGetConnectionTimes();
  const connectionCounts = useGetConnectionCounts();

  if (classroomExchanges.isError) return <p>Error!</p>;
  if (classroomExchanges.isLoading || classroomExchanges.isIdle) return <p>Loading...</p>;

  if (connectionTimes.isError) return <p>Error!</p>;
  if (connectionTimes.isLoading || connectionTimes.isIdle) return <p>Loading...</p>;

  if (connectionCounts.isError) return <p>Error!</p>;
  if (connectionCounts.isLoading || connectionCounts.isIdle) return <p>Loading...</p>;

  return (
    <>
      <div>
        <StatsCard data={15}>Nombre de classes inscrites</StatsCard>
        <StatsCard data={20}>Nombre de classes connectées</StatsCard>
        <StatsCard data={24}>Nombre de classes contributrices</StatsCard>
      </div>
      <div>
        <AverageStatsCard
          data={{
            min: Math.floor(connectionTimes.data.minDuration / 60),
            max: Math.floor(connectionTimes.data.maxDuration / 60),
            average: Math.floor(connectionTimes.data.averageDuration / 60),
            median: Math.floor(connectionTimes.data.medianDuration / 60),
          }}
          unit="min"
          icon={<AccessTimeIcon sx={{ fontSize: 'inherit' }} />}
        >
          Temps de connexion moyen par classe
        </AverageStatsCard>
        <AverageStatsCard
          data={{
            min: connectionCounts.data.minConnections,
            max: connectionCounts.data.maxConnections,
            average: connectionCounts.data.averageConnections,
            median: connectionCounts.data.medianConnections,
          }}
          icon={<VisibilityIcon sx={{ fontSize: 'inherit' }} />}
        >
          Nombre de connexions moyen par classe
        </AverageStatsCard>
      </div>
      <div>
        <ClassesExchangesCard
          totalPublications={classroomExchanges.data.totalActivities}
          totalComments={classroomExchanges.data.totalComments}
          totalVideos={classroomExchanges.data.totalVideos}
        />
      </div>
    </>
  );
};

export default GlobalStats;
