import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import styles from '../styles/charts.module.css';

const data = [
  { country: 'FR', total: 80 },
  { country: 'CA', total: 70 },
  { country: 'PT', total: 60 },
  { country: 'Grèce', total: 50 },
  { country: 'Maroc', total: 40 },
  { country: 'Tunisie', total: 30 },
  { country: 'Belgique', total: 20 },
  { country: 'Roumanie', total: 10 },
];

interface Data {
  highlightCountry: string;
}

export default function CustomBarChart({ highlightCountry }: Data) {
  return (
    <ResponsiveContainer width="100%" height={400} className={styles.horizontalBars}>
      <BarChart data={data} layout="vertical" barSize={15} barCategoryGap="15%" margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#666' }} />
        <YAxis type="category" dataKey="country" width={80} axisLine={false} tickLine={false} tick={{ fill: '#666', dx: -5 }} />

        <Tooltip />
        <Bar dataKey="total" radius={[10, 10, 10, 10]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.country === highlightCountry ? '#4C3ED9' : '#DAD7FE'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
