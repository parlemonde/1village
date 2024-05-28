import React from 'react';

import BarCharts from './charts/BarCharts';
import DashboardTable from './charts/DashboardTable';
import HorizontalChart from './charts/HorizontalChart';
import PieCharts from './charts/PieCharts';
import CountriesDropdown from './filters/CountriesDropdown';
import PhaseDropdown from './filters/PhaseDropdown';
import ClassesExchangesCard from './cards/ClassesExchangesCard/ClassesExchangesCard';
import StatsCard from './cards/StatsCard/StatsCard';
import styles from './styles/charts.module.css';

import { useGetClassroomExchanges } from 'src/api/statistics/statistics.get';

const pieChartData = {
  data: [
    { id: 0, value: 10, label: 'series A' },
    { id: 1, value: 15, label: 'series B' },
    { id: 2, value: 20, label: 'series C' },
  ],
};

const barChartData = [{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }];

const CountryStats = () => {
  const classroomExchanges = useGetClassroomExchanges();

  if (classroomExchanges.isError) return <p>Error!</p>;
  if (classroomExchanges.isLoading || classroomExchanges.isIdle) return <p>Loading...</p>;

  return (
    <>
      <div className={styles.filtersContainer}>
        <div className={styles.phaseFilter}>
          <PhaseDropdown />
        </div>
        <div className={styles.countryFilter}>
          <CountriesDropdown />
        </div>
      </div>
      <h1>Statut: Observateur</h1>
      <div className={styles.chartsContainer}>
        <HorizontalChart />
        <DashboardTable />
        <div className={styles.classroomStats}>
          <StatsCard data={10}>Nombre de classes inscrites</StatsCard>
          <StatsCard data={10}>Nombre de classes connectées</StatsCard>
          <StatsCard data={10}>Nombre de classes contributrices</StatsCard>
        </div>
        <div className={styles.engagementContainer}>
          <PieCharts pieChartData={pieChartData} />
          <BarCharts barChartData={barChartData} />
        </div>
      </div>
      <div className={styles.exchangesConnections}>
        <ClassesExchangesCard
          totalPublications={classroomExchanges.data.totalActivities}
          totalComments={classroomExchanges.data.totalComments}
          totalVideos={classroomExchanges.data.totalVideos}
          className={styles.exchangesCard}
        />
        <BarCharts barChartData={barChartData} className={styles.connections} />
      </div>
    </>
  );
};

export default CountryStats;
