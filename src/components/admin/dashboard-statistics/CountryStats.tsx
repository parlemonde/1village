import React from 'react';

import PieCharts from './charts/PieCharts';

const pieChartData = {
  data: [
    { id: 0, value: 10, label: 'series A' },
    { id: 1, value: 15, label: 'series B' },
    { id: 2, value: 25, label: 'series C' },
  ],
};

const CountryStats = () => {
  return (
    <>
      <h1>Pays</h1>
      <PieCharts pieChartData={pieChartData} />
    </>
  );
};

export default CountryStats;
