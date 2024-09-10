import React from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Grid } from '@mui/material';

import TeamComments from './TeamComments';
import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from './cards/StatsCard/StatsCard';
import DashboardWorldMap from './map/DashboardWorldMap/DashboardWorldMap';
import { useGetSessionsStats } from 'src/api/statistics/statistics.get';

const GlobalStats = () => {
  const sessionsStats = useGetSessionsStats(null);

  if (sessionsStats.isError) return <p>Error!</p>;
  if (sessionsStats.isLoading || sessionsStats.isIdle) return <p>Loading...</p>;

  // eslint-disable-next-line no-console
  console.log('Sessions stats', sessionsStats.data);

  return (
    <>
      <TeamComments />
      <DashboardWorldMap />
      <Grid container spacing={4} direction={{ xs: 'column', md: 'row' }}>
        <Grid item xs={12} lg={4}>
          <StatsCard data={10}>
            Nombre de classes <br />
            inscrites
          </StatsCard>
        </Grid>
        <Grid item xs={12} lg={4}>
          <StatsCard data={10}>
            Nombre de classes <br /> connectées
          </StatsCard>
        </Grid>
        <Grid item xs={12} lg={4}>
          <StatsCard data={10}>
            Nombre de classes <br /> contributrices
          </StatsCard>
        </Grid>
        <Grid item xs={12} lg={6}>
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
        </Grid>
        <Grid item xs={12} lg={6}>
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
        </Grid>
        <Grid item xs={12} lg={6}>
          <ClassesExchangesCard totalPublications={100} totalComments={100} totalVideos={100} />
        </Grid>
        {/* <div>
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
        </div> */}
      </Grid>
    </>
  );
};

export default GlobalStats;
