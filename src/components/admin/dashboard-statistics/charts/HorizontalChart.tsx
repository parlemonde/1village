import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import Typography from '@mui/material/Typography';

import DashboardCard from '../DashboardCard';
import type { CountryStat } from 'types/analytics/country-stat';

interface CustomBarChartProps {
  highlightedCountry: string;
  barsChartData: CountryStat[];
  onCountrySelect: (country: string) => void;
}

export default function CustomBarChart({ highlightedCountry, barsChartData, onCountrySelect }: Readonly<CustomBarChartProps>) {
  const handleClick = (entry: { country: string }) => {
    onCountrySelect(entry.country);
  };

  return (
    <DashboardCard>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={barsChartData} layout="vertical" barSize={15} barCategoryGap="15%" margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
          <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#666' }} />
          <YAxis type="category" dataKey="country" width={80} axisLine={false} tickLine={false} tick={{ fill: '#666', dx: -5 }} />

          <Tooltip />
          <Bar dataKey="total" radius={[16, 16, 16, 16]} onClick={handleClick}>
            {barsChartData.map((entry) => (
              <Cell key={`cell-${entry.country}`} fill={entry.country === highlightedCountry ? '#4C3ED9' : '#DAD7FE'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <Typography variant="caption" sx={{ fontStyle: 'italic', mt: 1, mb: 1, mr: 1, ml: 'auto', textAlign: 'right' }}>
        Publications & commentaires
      </Typography>
    </DashboardCard>
  );
}
