import React from 'react';
import type { Activity } from 'server/entities/activity';

import Paper from '@mui/material/Paper';

import ActivityCardAdmin from './ActivityCardAdmin';

type Props = {
  title: string;
  activities: Activity[];
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
          <div style={{ display: 'flex' }}>
            {activities.map((activity) => (
              <ActivityCardAdmin key={activity.id} {...activity} />
            ))}
          </div>
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
