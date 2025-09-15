import classNames from 'classnames';
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

import styles from '../styles/charts.module.css';
import type { ContributionBarChartData, ContributionBySteps } from 'types/dashboard.type';

interface ContributionBarChartProps {
  dataByStep: ContributionBarChartData;
  title?: string;
  className?: string;
}

const ContributionBarChart: React.FC<ContributionBarChartProps> = ({ dataByStep, title, className }) => {
  const dataWithPercent = dataByStep.dataBySteps.map((d: ContributionBySteps) => ({
    ...d,
    percent: Math.round((d.contributionCount / dataByStep.total) * 100),
  }));

  return (
    <div className={classNames(styles.contributionBarContainer, className)}>
      {title && <div className={styles.verticalTitle}>{title}</div>}
      <div className={styles.contributionChart}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={dataWithPercent}
            margin={{ top: 20, right: 10, left: 10, bottom: 0 }}
            barCategoryGap="35%" // espace entre les barres
          >
            <XAxis
              dataKey="step"
              tick={{ fontSize: 12 }}
              interval={0} // force chaque label à s'afficher
              height={55} // adapte selon besoin
              axisLine={false}
            />
            <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} axisLine={false} width={50} />
            <Tooltip formatter={(value) => `${value}%`} labelFormatter={(label) => `${label}`} cursor={{ fill: '#f3f3f3' }} />
            <Bar dataKey="percent" radius={[20, 20, 20, 20]}>
              {dataWithPercent.map((index) => (
                <Cell key={`cell-${index}`} fill="#69b3f0ff" />
              ))}
            </Bar>
            <text
              x="50%"
              y="98%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="11"
              fontWeight="initial"
              style={{ pointerEvents: 'none' }} // pour éviter de bloquer l'interaction du graphique
            >
              *une classe contributrice a publié au moins une fois dans la phase
            </text>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ContributionBarChart;
