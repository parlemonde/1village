import React from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VisibilityIcon from '@mui/icons-material/Visibility';

import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from './cards/StatsCard/StatsCard';
import { useGetClassroomExchanges } from 'src/api/statistics/statistics.get';

const GlobalStats = () => {
  const classroomExchanges = useGetClassroomExchanges();

  if (classroomExchanges.isError) return <p>Error!</p>;
  if (classroomExchanges.isLoading || classroomExchanges.isIdle) return <p>Loading...</p>;

  return (
    <>
      <div>
        <StatsCard data={15}>Nombre de classes inscrites</StatsCard>
        <StatsCard data={20}>Nombre de classes connectées</StatsCard>
        <StatsCard data={24}>Nombre de classes contributrices</StatsCard>
      </div>
      <div>
        <AverageStatsCard data={{ min: 1, max: 20, average: 15, median: 5 }} unit="min" icon={<AccessTimeIcon sx={{ fontSize: 'inherit' }} />}>
          Temps de connexion moyen par classe
        </AverageStatsCard>
        <AverageStatsCard data={{ min: 1, max: 20, average: 15, median: 5 }} icon={<VisibilityIcon sx={{ fontSize: 'inherit' }} />}>
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
