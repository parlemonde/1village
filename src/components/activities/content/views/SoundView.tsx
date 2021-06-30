import React from 'react';

import { Alert } from '@material-ui/lab';

import type { ViewProps } from '../content.types';

export const SoundView: React.FC<ViewProps> = ({ value }: ViewProps) => {
  return (
    <div className="text-center activity-data" style={{ padding: '1rem' }}>
      <audio controls src={value}>
        <Alert severity="error">{'Erreur: impossible de charger le son.'}</Alert>
      </audio>
    </div>
  );
};
