import classNames from 'classnames';
import React, { useState } from 'react';

import { BarChart } from '@mui/x-charts/BarChart';

import styles from '../styles/charts.module.css';

interface Props {
  dataByMonth: { month: string; barChartData: { value: number; isSelected: boolean }[] }[];
  title?: string;
  className?: string;
}

const BarCharts: React.FC<Props> = ({ dataByMonth, title, className }) => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(0);
  const selectedData = dataByMonth[selectedMonthIndex];

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedMonthIndex > 0) {
      setSelectedMonthIndex(selectedMonthIndex - 1);
    } else if (direction === 'next' && selectedMonthIndex < dataByMonth.length - 1) {
      setSelectedMonthIndex(selectedMonthIndex + 1);
    }
  };

  // Return early if no data is available
  if (!dataByMonth || dataByMonth.length === 0 || !selectedData) {
    return (
      <div className={classNames(styles.barContainer, className)}>
        {title && <div className={styles.title}>{title}</div>}
        <div className={styles.chart}>
          <p>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classNames(styles.barContainer, className)}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.selector}>
        <button onClick={() => handleMonthChange('prev')}>&lt;</button>
        <span>{selectedData.month}</span>
        <button onClick={() => handleMonthChange('next')}>&gt;</button>
      </div>
      <div className={styles.chart}>
        <BarChart
          sx={{
            '& .MuiChartsAxis-bottom .MuiChartsAxis-line': {
              strokeWidth: 0,
            },
            '& .MuiChartsAxis-left .MuiChartsAxis-line': {
              strokeWidth: 0,
            },
          }}
          xAxis={[
            {
              scaleType: 'band',
              data: selectedData.barChartData.map((_, index) => index + 1),
              tickSize: 0,
            },
          ]}
          yAxis={[{ tickSize: 0 }]}
          series={[
            {
              data: selectedData.barChartData.map((data) => data.value),
            },
          ]}
          slotProps={{
            bar: {
              clipPath: `inset(0px round 40px)`,
            },
          }}
        />
      </div>
    </div>
  );
};

export default BarCharts;
