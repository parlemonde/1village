import React from 'react';

import DashboardStatsNav from 'src/components/admin/dashboard-statistics/DashboardStatsNav';

const Analyser = () => {
  const renderTitle = () => {
    return (
      <div>
        <h1>Analyser</h1>
        <DashboardStatsNav />
      </div>
    );
  };

  return <>{renderTitle()}</>;
};

export default Analyser;
