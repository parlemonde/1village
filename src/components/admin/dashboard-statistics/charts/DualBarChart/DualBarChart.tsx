import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from 'recharts';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface ClassroomChartData {
  name: string;
  value: number;
}

export interface CountryChartData {
  country: string;
  data: ClassroomChartData[];
}

interface DualBarChartProps {
  data: CountryChartData[];
}

export default function DualBarChart({ data }: DualBarChartProps) {
  const maxValue = Math.max(...data.flatMap((country) => country.data.map((item) => item.value)));

  const VerticalLabelInsideBar = (props: any) => {
    const { x, y, width, height, value } = props;
    const label: string = String(value ?? '');

    if (!label) return null;

    const cx = x + width / 2;
    const cy = y + height / 2;

    const baseSize = Math.floor(width * 0.8);
    const fontSize = Math.max(8, Math.min(14, baseSize));

    return (
      <text
        x={cx}
        y={cy}
        fill="#fff"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={fontSize}
        fontWeight="bold"
        transform={`rotate(-90, ${cx}, ${cy})`}
      >
        {label}
      </text>
    );
  };

  const renderBarChart = (countryChartData: CountryChartData, barChartColor: string, showYAxisLabels: boolean = false) => {
    return (
      <Box width="45%" display="flex" flexDirection="column" alignItems="center">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={countryChartData.data} barSize={15} margin={{ top: 0, right: 15, left: 15, bottom: 0 }}>
            <YAxis type="number" tickLine={false} axisLine={false} tick={showYAxisLabels} domain={[0, maxValue]} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tick={false} />
            <Tooltip />
            <Bar dataKey="value" fill={barChartColor} radius={[16, 16, 16, 16]}>
              <LabelList dataKey="name" position="insideTop" content={<VerticalLabelInsideBar />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div>{countryChartData.country}</div>
      </Box>
    );
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="center"
      padding={4}
      borderRadius={6}
      sx={{ backgroundColor: '#f5f5f5' }}
    >
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
      {renderBarChart(data[0], '#78BEFF', true)}
      {renderBarChart(data[1], '#FF57F8')}
    </Box>
  );
}
