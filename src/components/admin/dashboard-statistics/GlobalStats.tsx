import React from 'react';

import StatsCard from './cards/StatsCard';

const GlobalStats = () => {
  return (
    <div>
      <StatsCard data={15}>Nombre de classes inscrites</StatsCard>
    </div>
  );
};

export default GlobalStats;
