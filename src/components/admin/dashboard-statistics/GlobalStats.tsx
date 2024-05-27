import React from 'react';

import StatsCard from './cards/StatsCard';

const GlobalStats = () => {
  return (
    <div>
      <StatsCard data={15}>Nombre de classes inscrites</StatsCard>
      <StatsCard data={20}>Nombre de classes connectées</StatsCard>
    </div>
  );
};

export default GlobalStats;
