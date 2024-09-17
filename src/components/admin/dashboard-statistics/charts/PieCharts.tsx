import React from 'react';

import { Stack } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';

import styles from '../styles/charts.module.css';

type PieChartDataItem = {
  id: number;
  value: number;
  label: string;
};

type PieChartData = {
  data: PieChartDataItem[];
};

interface Props {
  pieChartData: PieChartData;
}

const PieCharts: React.FC<Props> = ({ pieChartData }) => {
  const labels = pieChartData.data.map((item) => item.label);

  return (
    <div className={styles.pieContainer}>
      <p style={{ fontWeight: 600 }}>Niveau engagement</p>
      <Stack justifyContent="center" alignItems="center">
        <PieChart
          margin={{ bottom: 70, left: 50, right: 50 }}
          p={0}
          series={[{ data: pieChartData.data }]}
          width={250}
          height={250}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'bottom', horizontal: 'middle' },
            },
          }}
        />
      </Stack>
    </div>
  );
};

export default PieCharts;
