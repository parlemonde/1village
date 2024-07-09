import React from 'react';

// import ClassroomDetailsCard from './cards/ClassroomDetailsCard/ClassroomDetailsCard';
import BarCharts from './charts/BarCharts';

const barChartData = [{ data: [4, 3, 5] }, { data: [1, 6, 3] }, { data: [2, 5, 6] }];

const ClassroomStats = () => {
  return (
    <>
      <h1>Classe</h1>
      {/* <ClassroomDetailsCard /> */}
      <BarCharts barChartData={barChartData} />
    </>
  );
};

export default ClassroomStats;
