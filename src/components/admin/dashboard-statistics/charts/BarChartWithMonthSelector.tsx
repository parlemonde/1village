import React, { useState } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Label } from 'recharts';

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { IconButton } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import DashboardCard from '../DashboardCard';
import type { DailyConnectionsCountsByMonth } from 'types/statistics.type';

interface BarChartWithMonthSelectorProps {
  data: DailyConnectionsCountsByMonth[];
  title?: string;
  yAxisLabel?: string;
}

const isCurrentMonth = (label: string): boolean => {
  if (!label) return false;

  const now = new Date();
  const year = String(now.getFullYear());
  const monthFr = now.toLocaleString('fr-FR', { month: 'long' });

  return label.includes(year) && label.includes(monthFr);
};

const BarChartWithMonthSelector = ({ data, yAxisLabel, title }: BarChartWithMonthSelectorProps) => {
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(Math.max(0, data.length - 1));

  if (!data || data.length === 0) {
    return (
      <DashboardCard>
        <Box width="100%">
          {title && <Typography fontWeight={600}>{title}</Typography>}
          <Box display="flex" alignItems="center" justifyContent="center" height={300}>
            <Typography color="text.secondary">Aucune donnée disponible</Typography>
          </Box>
        </Box>
      </DashboardCard>
    );
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

  const todayIndex = isCurrentMonth(selectedData?.monthLabel) ? new Date().getDate() - 1 : -1;
  const maxValue = Math.max(0, ...(selectedData?.counts ?? []));
  const yMax = Math.max(1, maxValue);

  return (
    <DashboardCard>
      <Box width="100%">
        {title && <Typography fontWeight={600}>{title}</Typography>}
        {data?.length === 0 ? (
          <Box display="flex" alignItems="center" justifyContent="center" height={300}>
            <Typography color="text.secondary">Aucune donnée disponible</Typography>
          </Box>
        ) : (
          <>
            <Box display="flex" alignItems="center" justifyContent="center" mb={2} gap={3}>
              <IconButton size="small" onClick={showPreviousMonthData} disabled={!canShowPreviousMonthData} aria-label="Previous month">
                <ChevronLeftIcon />
              </IconButton>
              <Typography fontWeight={500}>{selectedData.monthLabel}</Typography>
              <IconButton size="small" onClick={showNextMonthData} disabled={!canShowNextMonthData} aria-label="Next month">
                <ChevronRightIcon />
              </IconButton>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="center">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={selectedData.counts.map((count, i) => ({ index: i + 1, value: count }))}
                  barSize={17}
                  margin={{ top: 0, right: 0, left: 24, bottom: 24 }}
                >
                  <YAxis
                    type="number"
                    domain={[0, yMax]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 14, fill: '#374151' }}
                    tickMargin={12}
                    label={{ value: yAxisLabel, angle: -90, position: 'left', dy: -75 }}
                  />
                  <XAxis dataKey="index" interval={0} tickLine={false} axisLine={false} tick={{ fontSize: 14, fill: '#374151' }} tickMargin={8}>
                    <Label position="bottom" offset={6}>
                      Jour du mois
                    </Label>
                  </XAxis>
                  <Tooltip
                    formatter={(value) => [value, 'Connexion']}
                    labelFormatter={(label) => `${label} ${data[selectedMonthIndex].monthLabel}`}
                  />
                  <Bar dataKey="value" radius={[16, 16, 16, 16]}>
                    {selectedData.counts.map((_entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === todayIndex ? '#4339F2' : '#DAD7FE'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </>
        )}
      </Box>
    </DashboardCard>
  );
};

export default BarChartWithMonthSelector;
