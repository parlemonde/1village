import React from 'react';

import AccessTimeIcon from '@mui/icons-material/AccessTime';

import AverageStatsCard from './cards/AverageStatsCard/AverageStatsCard';
import StatsCard from './cards/StatsCard/StatsCard';

const GlobalStats = () => {
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
      </div>
    </>
  );
};

export default GlobalStats;
