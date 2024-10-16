import React from 'react';
import type { Activity } from 'server/entities/activity';

import { Button, useMediaQuery } from '@mui/material';
import Paper from '@mui/material/Paper';

import ActivityCardAdmin from './ActivityCardAdmin';

type Props = {
  title: string;
  activities: Activity[];
  svgNoData: React.ReactNode;
  noDataText: string;
  buttonAction: () => void;
  modifiedDisabled?: boolean;
};

export default function ActivityCardAdminList({ title, activities, svgNoData, noDataText, buttonAction, modifiedDisabled }: Props) {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Paper
      sx={{
        borderRadius: 4,
      }}
    >
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
          <Button onClick={buttonAction} size="small" sx={{ border: 1, margin: 1 }}>
            Afficher plus
          </Button>
        </div>
        {activities.length ? (
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
            {activities.map((activity) => (
              <div key={activity.id} style={{ width: isMobile ? '100%' : '50%' }}>
                {/* eslint-disable-next-line */}
                {/* @ts-ignore */}
                <ActivityCardAdmin activity={activity} modifiedDisabled={modifiedDisabled} />
              </div>
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
