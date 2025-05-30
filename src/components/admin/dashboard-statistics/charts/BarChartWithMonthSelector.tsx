import React, { useState } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import DashboardCard from '../DashboardCard';
import type { DailyCountByMonth } from 'types/statistics.type';

interface BarChartWithMonthSelectorProps {
  data: DailyCountByMonth[];
  legend?: string;
  title?: string;
}

const isCurrentMonth = (label: string): boolean => {
  if (!label) return false;

  const now = new Date();
  const year = String(now.getFullYear());
  const monthFr = now.toLocaleString('fr-FR', { month: 'long' });

  return label.includes(year) && label.includes(monthFr);
};

const BarChartWithMonthSelector = ({ data, legend, title }: BarChartWithMonthSelectorProps) => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(data.length - 1);

  if (!data || data.length === 0) {
    return null;
  }

  const selectedData = data[selectedMonthIndex];
  const canShowPreviousMonthData = selectedMonthIndex > 0;
  const canShowNextMonthData = selectedMonthIndex < data.length - 1;

  const showPreviousMonthData = () => {
    canShowPreviousMonthData && setSelectedMonthIndex(selectedMonthIndex - 1);
  };

  const showNextMonthData = () => {
    canShowNextMonthData && setSelectedMonthIndex(selectedMonthIndex + 1);
  };

  const todayIndex = isCurrentMonth(selectedData.month) ? new Date().getDate() - 1 : -1;
  const maxValue = Math.max(0, ...selectedData.counts.map((entry) => entry.value));
  const yMax = Math.max(1, maxValue);

  return (
    <DashboardCard>
      <Box width="100%">
        {title && <Typography fontWeight={600}>{title}</Typography>}
        <Box display="flex" alignItems="center" justifyContent="center" mb={2} gap={3}>
          <IconButton size="small" onClick={showPreviousMonthData} disabled={!canShowPreviousMonthData} aria-label="Previous month">
            <ChevronLeftIcon />
          </IconButton>
          <Typography fontWeight={500}>{selectedData.month}</Typography>
          <IconButton size="small" onClick={showNextMonthData} disabled={!canShowNextMonthData} aria-label="Next month">
            <ChevronRightIcon />
          </IconButton>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={selectedData.counts.map((entry, i) => ({ index: i + 1, value: entry.value }))}
              barSize={17}
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <YAxis type="number" domain={[0, yMax]} tickLine={false} axisLine={false} tick={{ fontSize: 14, fill: '#374151' }} />
              <XAxis dataKey="index" interval={0} tickLine={false} axisLine={false} tick={{ fontSize: 14, fill: '#374151' }} />
              <Tooltip />
              {legend && (
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value) => <span style={{ color: '#000' }}>{value}</span>}
                  payload={[{ value: legend, type: 'circle', id: 'connections', color: '#DAD7FE' }]}
                />
              )}
              <Bar dataKey="value" radius={[16, 16, 16, 16]}>
                {selectedData.counts.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === todayIndex ? '#4339F2' : '#DAD7FE'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </DashboardCard>
  );
};

export default BarChartWithMonthSelector;
