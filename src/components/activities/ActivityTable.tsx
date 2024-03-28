import React from 'react';

import type { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';

import { phasesObject } from 'src/utils/phases';

export default function ActivitiesTable() {
  const rows: GridRowsProp = [
    // A row example of how it should look
    // { id: 1, 'village-name': 'Test', 'message-lancement-phase-1': 'Hello', 'relance-phase-1': 'World' },
  ];
  const firstEmptyCol: GridColDef[] = [{ field: 'village-name', headerName: '', width: 200 }];
  const columns: GridColDef[] = firstEmptyCol.concat(
    ...phasesObject.reduce<GridColDef[]>((acc, curr) => {
      acc.push(...curr.steps.map((e) => ({ field: e.id, headerName: e.name, width: 150 })));
      return acc;
    }, []),
  );
  return (
    <>
      <h1
        style={{
          marginTop: 30,
          marginBottom: 30,
        }}
      >
        Dashboard des activités
      </h1>
      <div style={{ overflowX: 'auto' }}>
        <DataGrid rows={rows} columns={columns} columnHeaderHeight={50} hideFooter disableColumnFilter disableColumnMenu disableColumnSelector />
      </div>
    </>
  );
}
