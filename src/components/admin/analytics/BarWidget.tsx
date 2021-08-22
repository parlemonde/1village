import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import { Tab, Tabs, Paper } from '@material-ui/core';

import { primaryColorLight } from 'src/styles/variables.const';

const SmallTabs = withStyles({
  root: {
    minHeight: 'unset',
  },
})(Tabs);

const SmallTab = withStyles({
  root: {
    minWidth: 'unset',
    minHeight: 'unset',
    padding: '0.25rem',
    fontSize: '0.88rem',
    textTransform: 'none',
  },
})(Tab);

interface BarWidgetProps {
  name: string;
  datasets: Array<{
    name: string;
    labels: string[];
    data: Array<{
      key: string;
      value: number;
    }>;
  }>;
}

export const BarWidget = ({ name, datasets }: BarWidgetProps) => {
  const [tab, selectedTab] = React.useState(0);

  const handleChange = (_e: React.ChangeEvent<unknown>, newValue: number) => {
    selectedTab(newValue);
  };

  const { data, max } = React.useMemo(() => {
    if (!datasets[tab]) {
      return {
        data: [] as Array<{
          key: string;
          value: number;
        }>,
        max: 0,
      };
    }

    return {
      data: datasets[tab].data.sort((b, a) => a.value - b.value),
      max: Math.max(0, ...datasets[tab].data.map((d) => d.value)),
    };
  }, [tab, datasets]);

  return (
    <Paper style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ margin: '0.25rem 0' }}>
          <strong>{name}</strong>
        </div>
        {datasets.length > 1 && (
          <SmallTabs value={tab} onChange={handleChange} indicatorColor="primary" textColor="primary">
            {datasets.map((d) => (
              <SmallTab key={d.name} label={d.name} />
            ))}
          </SmallTabs>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {datasets[tab]?.labels?.map((l, index) => (
          <span key={index}>{l}</span>
        ))}
      </div>

      <div style={{ height: '20rem', overflow: 'auto' }}>
        {data.map((d, index) => (
          <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.25rem 0', cursor: 'pointer' }}>
            <div style={{ flex: 1, position: 'relative', padding: '0.25rem 0.5rem' }}>
              <div
                style={{
                  position: 'absolute',
                  width: `${Math.max((d.value / max) * 100, 1)}%`,
                  height: '100%',
                  left: 0,
                  top: 0,
                  backgroundColor: primaryColorLight,
                }}
              ></div>
              <span style={{ position: 'relative', zIndex: 1 }}>{d.key}</span>
            </div>
            <div style={{ width: '4rem', textAlign: 'right' }}>{d.value}</div>
          </div>
        ))}
      </div>
    </Paper>
  );
};
