import React from 'react';

import DashboardStatsNav from 'src/components/dashboard-statistics/DashboardStatsNav';

const Analyser = () => {
  const renderTitle = () => {
    return <DashboardStatsNav />;
  };

  return <>{renderTitle()}</>;
};

export default Analyser;
