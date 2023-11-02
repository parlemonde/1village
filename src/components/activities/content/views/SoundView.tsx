import React from 'react';

import Alert from '@mui/material/Alert';

import type { ViewProps } from '../content.types';

export const SoundView = ({ value }: ViewProps) => {
  return (
    <div className="text-center activity-data" style={{ padding: '1rem' }}>
      <audio controls src={value}>
        <Alert severity="error">{'Erreur: impossible de charger le son.'}</Alert>
      </audio>
    </div>
  );
};
