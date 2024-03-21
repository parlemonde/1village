import React from 'react';
import type { Activity } from 'server/entities/activity';

import { Button } from '@mui/material';
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
        <div
          style={{
            display: 'flex',
            width: '100%',
            justifyContent: 'space-between',
          }}
        >
          <h2>{title}</h2>
          <Button size="small" sx={{ border: 1, margin: 1 }}>
            Afficher plus
          </Button>
        </div>
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
