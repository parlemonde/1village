import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import DashboardCard from '../../DashboardCard';
import type { CountryClassroomsContribution } from 'types/statistics.type';

interface DualBarChartProps {
  contributionsByCountryClassrooms: CountryClassroomsContribution[];
}

export default function DualBarChart({ contributionsByCountryClassrooms }: DualBarChartProps) {
  const maxValue = Math.max(
    ...contributionsByCountryClassrooms.flatMap((countryContribution) =>
      countryContribution.classroomsContributions.map((classroomContribution) => classroomContribution.total),
    ),
  );

  const VerticalLabelInsideBar = (props: any) => {
    const { x, y, width, height, value } = props;
    const label = String(value ?? '');
    if (!label) return null;

    const labelX = x + width / 6;
    const labelY = y + height - 10;

    return (
      <text
        x={labelX}
        y={labelY}
        fill="#000000ff"
        textAnchor="start"
        dominantBaseline="hanging"
        fontSize={'0.65rem'}
        transform={`rotate(-90, ${labelX}, ${labelY})`}
      >
        {label}
      </text>
    );
  };

  const renderBarChart = (countryChartData: CountryClassroomsContribution, barChartColor: string, showYAxisLabels: boolean = false) => {
    return (
      <Box width="45%" display="flex" flexDirection="column" alignItems="center">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={countryChartData.classroomsContributions} barSize={15} margin={{ top: 0, right: 15, left: 15, bottom: 0 }}>
            <YAxis type="number" tickLine={false} axisLine={false} tick={showYAxisLabels} domain={[0, maxValue]} />
            <XAxis dataKey="classroomName" tickLine={false} axisLine={false} tick={false} />
            <Tooltip />
            <Bar dataKey="total" fill={barChartColor} radius={[16, 16, 16, 16]}>
              <LabelList dataKey="classroomName" position="insideTop" content={<VerticalLabelInsideBar />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <Typography>{countryChartData.countryName}</Typography>
      </Box>
    );
  };

  return (
    <DashboardCard flexDirection="row">
      <Typography
        variant="caption"
        sx={{
          writingMode: 'vertical-rl',
          fontStyle: 'italic',
          transform: 'rotate(180deg)',
        }}
      >
        Publications & commentaires
      </Typography>
      {renderBarChart(contributionsByCountryClassrooms[0], '#78BEFF', true)}
      {renderBarChart(contributionsByCountryClassrooms[1], '#FF57F8')}
    </DashboardCard>
  );
}
