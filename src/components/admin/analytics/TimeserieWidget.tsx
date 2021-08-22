import { Chart, ChartConfiguration, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip } from 'chart.js';
import React from 'react';

import { KeepRatio } from 'src/components/KeepRatio';
import { primaryColor, primaryColorLight, primaryColorLight2 } from 'src/styles/variables.const';
import { AnalyticData } from 'types/analytics.type';

Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip);

const COLORS = [primaryColor, primaryColorLight2, primaryColorLight];
const CONFIG: Omit<ChartConfiguration<'line', number[], string>, 'data'> = {
  type: 'line' as const,
  options: {
    elements: {
      point: {
        radius: 0,
      },
    },
    aspectRatio: 3,
    plugins: {
      tooltip: {
        enabled: true,
        intersect: false,
        animation: {
          duration: 100,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: 10,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        min: 0,
        grid: {
          drawTicks: false,
        },
        ticks: {
          padding: 10,
        },
      },
    },
  },
};

interface TimeserieWidgetProps {
  title?: string;
  labels: number[];
  datasets: {
    name: string;
    data: number[];
  }[];
  aggregation: AnalyticData['aggregation'];
}

const getLabel = (date: Date, aggregation: AnalyticData['aggregation']): string => {
  if (aggregation === 'hour') {
    return `${date.getHours()}:00`;
  }
  if (aggregation === 'day') {
    return `${date.getDate()} ${date.toLocaleString('fr-FR', { month: 'long' })}`;
  }
  return date.toLocaleString('fr-FR', { month: 'long' });
};

export const TimeserieWidget = ({ title, labels, datasets, aggregation }: TimeserieWidgetProps) => {
  const canvas = React.useRef<HTMLCanvasElement | null>(null);
  const chart = React.useRef<Chart<'line', number[], string> | null>(null);

  const data = React.useMemo(
    () => ({
      labels: labels.map((l) => getLabel(new Date(l), aggregation)),
      datasets: datasets.map((s, idx) => ({
        label: s.name,
        backgroundColor: COLORS[idx % COLORS.length],
        borderColor: COLORS[idx % COLORS.length],
        data: s.data,
      })),
    }),
    [labels, datasets, aggregation],
  );

  React.useEffect(() => {
    if (chart.current) {
      chart.current.destroy();
    }
    if (canvas.current) {
      chart.current = new Chart(canvas.current, { ...CONFIG, data });
    }
  }, [data]);

  return (
    <>
      {title && <div style={{ margin: '0.25rem 0' }}>{title}</div>}
      <div style={{ marginBottom: '0.5rem' }}>
        <KeepRatio ratio={1 / 3}>
          <canvas ref={canvas} />
        </KeepRatio>
      </div>
    </>
  );
};
