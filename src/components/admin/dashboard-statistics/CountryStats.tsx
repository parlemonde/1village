import React from 'react';

import BarCharts from './charts/BarCharts';
import DashboardTable from './charts/DashboardTable';
import HorizontalChart from './charts/HorizontalChart';
import PieCharts from './charts/PieCharts';
import PhaseDropdown from './filters/PhaseDropdown';
import CountriesDropdown from './filters/CountriesDropdown';
import styles from './styles/charts.module.css';

const pieChartData = {
  data: [
    { id: 0, value: 10, label: 'series A' },
    { id: 1, value: 15, label: 'series B' },
    { id: 2, value: 20, label: 'series C' },
  ],
};

const barChartData = [{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }];

const CountryStats = () => {
  return (
    <>
      <div className={styles.filtersContainer}>
        <PhaseDropdown />
        <CountriesDropdown />
      </div>
      <h1>Statut: Observateur</h1>
      <div className={styles.chartsContainer}>
        <HorizontalChart />
        <DashboardTable />
        <div className={styles.engamentContainer}>
          <PieCharts pieChartData={pieChartData} />
          <BarCharts barChartData={barChartData} />
        </div>
      </div>
    </>
  );
};

export default CountryStats;
