import React from 'react';

import BarCharts from './charts/BarCharts';

const barChartData = [{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }];

const ClassroomStats = () => {
  return (
    <>
      <h1>Classe</h1>;
      <BarCharts barChartData={barChartData} />
    </>
  );
};

export default ClassroomStats;
