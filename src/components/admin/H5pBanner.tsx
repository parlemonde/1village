import React from 'react';

import { Button } from '@mui/material';

type Props = {
  title: string;
  type: string;
  lastUpdatedAt: Date;
  onUpdate: () => void;
  onDelete: () => void;
};

export default function H5pBanner({ title, type, lastUpdatedAt, onUpdate, onDelete }: Props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', border: '1px solid #4c3ed9', borderRadius: '10px', width: '100%' }}>
      <div style={{ width: '80%', display: 'flex', justifyContent: 'space-around' }}>
        <div>{title}</div>
        <div>{type}</div>
        <div>{lastUpdatedAt.toISOString()}</div>
      </div>
      <div style={{ display: 'flex' }}>
        <Button onClick={onUpdate}>update</Button>
        <Button onClick={onDelete}>delete</Button>
      </div>
    </div>
  );
}
