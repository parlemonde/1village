import React from 'react';

import Paper from '@mui/material/Paper';

import ActivityCardAdmin from './ActivityCardAdmin';

type Props = {
  title: string;
  activities: Array<Record<string, unknown>>;
  svgNoData: unknown;
  noDataText: string;
};

export default function ActivityCardAdminList({ title, activities, svgNoData, noDataText }: Props) {
  return (
    <Paper>
      <div
        style={{
          padding: 10,
          margin: 10,
        }}
      >
        <h2>{title}</h2>
        {activities.length ? (
          activities.map((_e, i) => (
            <div key={i}>
              <ActivityCardAdmin />
            </div>
          ))
        ) : (
          <div
            style={{
              paddingLeft: 20,
              marginTop: 30,
            }}
          >
            <p>{noDataText}</p>
            {svgNoData}
          </div>
        )}
      </div>
    </Paper>
  );
}
