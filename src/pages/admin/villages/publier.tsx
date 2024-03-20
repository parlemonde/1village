import React from 'react';

import type { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';

import ActivityCardAdminList from '../../../components/activities/ActivityCard/activity-admin/ActivityCardAdminList';
import PelicoStar from 'src/svg/pelico/pelico_star.svg';
import PelicoVacances from 'src/svg/pelico/pelico_vacances.svg';
import { phasesObject } from 'src/utils/phases';

const rows: GridRowsProp = [
  // { id: 1, col1: 'Hello', col2: 'World' },
  // { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  // { id: 3, col1: 'MUI', col2: 'is Amazing' },
];

const columns: GridColDef[] = phasesObject.reduce<GridColDef[]>((acc, curr) => {
  acc.push(...curr.steps.map((e) => ({ field: e.id, headerName: e.name })));
  return acc;
}, []);

const Publier = () => {
  return (
    <div>
      <h1>Publier</h1>
      <p>C’est dans cet espace, que les administrateurs et administratrices du site vont pouvoir gérer les publications sur 1VIllage.</p>

      <ActivityCardAdminList
        title="Activités récentes non publiées"
        activities={[]}
        noDataText="Il n'y a aucune activitées non publiée"
        svgNoData={<PelicoStar style={{ height: '6rem', width: '6rem' }} />}
      />
      <ActivityCardAdminList
        title="Activités publiées"
        activities={[]}
        noDataText="Aucune activitées n'a été publiée pour le moment"
        svgNoData={<PelicoVacances style={{ height: '6rem', width: '6rem' }} />}
      />
      <h1
        style={{
          marginTop: 30,
        }}
      >
        Dashboard des activités
      </h1>
      <div style={{ overflowX: 'auto' }}>
        <DataGrid rows={rows} columns={columns} hideFooter />
      </div>
    </div>
  );
};

export default Publier;
