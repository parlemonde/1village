import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import Typography from '@mui/material/Typography';

import DashboardCard from '../DashboardCard';
import type { CountryContribution } from 'types/statistics.type';

interface HorizontalBarChartProps {
  selectedCountry: string;
  barsChartData: CountryContribution[];
  onCountrySelect: (country: string) => void;
}

export default function HorizontalBarChart({ selectedCountry, barsChartData, onCountrySelect }: Readonly<HorizontalBarChartProps>) {
  const handleClick = (countryContribution: CountryContribution) => {
    onCountrySelect(countryContribution.countryCode);
  };

  /**  On calcule la taille du graphique en fonction du nombre de pays, le nombre 45 a été trouvé en faisant des
   *   essayages avec différents nombres de pays
   */
  const barHeight = 45 * barsChartData.length;

  return (
    <DashboardCard>
      <ResponsiveContainer width="100%" height={barHeight}>
        <BarChart data={barsChartData} layout="vertical" barSize={15} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
          <XAxis type="number" axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="countryName" width={80} axisLine={false} tickLine={false} />

          <Tooltip />
          <Bar dataKey="total" radius={[16, 16, 16, 16]} onClick={handleClick}>
            {barsChartData.map((entry) => (
              <Cell key={`cell-${entry.countryName}`} fill={entry.countryCode === selectedCountry ? '#4C3ED9' : '#DAD7FE'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <Typography variant="caption" sx={{ fontStyle: 'italic', mt: 1, mb: 1, mr: 1, ml: 'auto', textAlign: 'right' }}>
        Publications et commentaires
      </Typography>
    </DashboardCard>
  );
}
