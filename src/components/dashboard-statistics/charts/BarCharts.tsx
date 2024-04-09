import type React from 'react';

import { BarChart } from '@mui/x-charts/BarChart';

import styles from '../styles/charts.module.css';

type BarChartDataItem = {
  data: number[];
};

type BarChartData = {
  dt: BarChartDataItem[];
};

interface Props {
  barChartData: BarChartData;
}

const BarCharts: React.FC<Props> = ({ barChartData }) => {
  const numericData = barChartData.dt.flatMap((item) => item.data);
  return null;
  return (
    <BarChart xAxis={[{ scaleType: 'band', data: ['group A', 'group B', 'group C'] }]} series={[{ data: numericData }]} width={500} height={300} />
  );
};

export default BarCharts;
