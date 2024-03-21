import React from 'react';

import type { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';

import { useGetActivities } from 'src/api/activities/activities.get';
import ActivityCardAdminList from 'src/components/activities/ActivityCard/activity-admin/ActivityCardAdminList';
import PelicoStar from 'src/svg/pelico/pelico_star.svg';
import PelicoVacances from 'src/svg/pelico/pelico_vacances.svg';
import { phasesObject } from 'src/utils/phases';

const rows: GridRowsProp = [
  { id: 1, 'village-name': 'Test', 'message-lancement-phase-1': 'Hello', 'relance-phase-1': 'World' },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
];
const firstEmptyCol: GridColDef[] = [{ field: 'village-name', headerName: '', width: 200 }];
const columns: GridColDef[] = firstEmptyCol.concat(
  ...phasesObject.reduce<GridColDef[]>((acc, curr) => {
    acc.push(...curr.steps.map((e) => ({ field: e.id, headerName: e.name, width: 250 })));
    return acc;
  }, []),
);

const Publier = () => {
  const draftActivities = useGetActivities({ limit: 2, isDraft: true, isPelico: true });
  const publishedActivities = useGetActivities({ limit: 2, isDraft: false, isPelico: true });
  if (draftActivities.isError) return <p>Error!</p>;
  if (draftActivities.isLoading || draftActivities.isIdle) return <p>Loading...</p>;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '60vw',
      }}
    >
      <h1>Publier</h1>
      <p>C’est dans cet espace, que les administrateurs et administratrices du site vont pouvoir gérer les publications sur 1VIllage.</p>
      <div style={{ margin: 10 }}>
        <ActivityCardAdminList
          title="Activités récentes non publiées"
          activities={draftActivities.data}
          noDataText="Il n'y a aucune activitées non publiée"
          svgNoData={<PelicoStar style={{ height: '6rem', width: '6rem' }} />}
        />
      </div>
      <div style={{ margin: 10 }}>
        <ActivityCardAdminList
          title="Activités publiées"
          activities={publishedActivities.data ?? []}
          noDataText="Aucune activitées n'a été publiée pour le moment"
          svgNoData={<PelicoVacances style={{ height: '6rem', width: '6rem' }} />}
        />
      </div>
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
    </div>
  );
};

export default Publier;
