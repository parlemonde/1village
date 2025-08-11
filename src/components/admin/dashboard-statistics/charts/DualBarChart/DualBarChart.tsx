import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface ClassroomChartData {
  name: string;
  value: number;
}

export interface CountryChartData {
  country: string;
  data: ClassroomChartData[];
}

interface DualBarChartProps {
  firstTable: CountryChartData;
  secondTable: CountryChartData;
}

export default function DualBarChart({ firstTable, secondTable }: Readonly<DualBarChartProps>) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px', backgroundColor: '#f7f7f9', borderRadius: '10px' }}>
      <ResponsiveContainer width="45%" height={300}>
        <BarChart data={firstTable.data} barSize={15} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <YAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#666' }} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#666' }} />
          <Tooltip />
          <Bar dataKey="value" fill="#42a5f5" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ textAlign: 'center' }}>{firstTable.country}</div>

      <ResponsiveContainer width="45%" height={300}>
        <BarChart data={secondTable.data} barSize={15} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <YAxis type="number" tickLine={false} axisLine={false} tick={{ fill: '#666' }} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#666' }} />
          <Tooltip />
          <Bar dataKey="value" fill="#ec407a" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ textAlign: 'center' }}>{secondTable.country}</div>
    </div>
  );
}
