import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import styles from '../styles/charts.module.css';
import type { CountryStat } from 'types/analytics/country-stat';

interface CustomBarChartProps {
  highlightedCountry: string;
  barsChartData: CountryStat[];
}

export default function CustomBarChart({ highlightedCountry, barsChartData }: Readonly<CustomBarChartProps>) {
  return (
    <ResponsiveContainer width="100%" height={400} className={styles.horizontalBars}>
      <BarChart data={barsChartData} layout="vertical" barSize={15} barCategoryGap="15%" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#666' }} />
        <YAxis type="category" dataKey="country" width={80} axisLine={false} tickLine={false} tick={{ fill: '#666', dx: -5 }} />

        <Tooltip />
        <Bar dataKey="total" radius={[10, 10, 10, 10]}>
          {barsChartData.map((entry) => (
            <Cell key={`cell-${entry.country}`} fill={entry.country === highlightedCountry ? '#4C3ED9' : '#DAD7FE'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
