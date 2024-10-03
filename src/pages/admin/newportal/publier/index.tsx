import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import type { GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { DataGrid } from '@mui/x-data-grid';

import { useGetActivitiesAdminDraft } from 'src/api/activities/activities.admin.get';
import ActivityCardAdminList from 'src/components/activities/ActivityCard/activity-admin/ActivityCardAdminList';
import { UserContext } from 'src/contexts/userContext';
import PelicoStar from 'src/svg/pelico/pelico_star.svg';
import PelicoVacances from 'src/svg/pelico/pelico_vacances.svg';
import { UserType } from 'types/user.type';

const rows: GridRowsProp = [
  // A row example of how it should look
  // { id: 1, 'village-name': 'Test', 'message-lancement-phase-1': 'Hello', 'relance-phase-1': 'World' },
];
const columns: GridColDef[] = [];

const Publier = () => {
  const { user } = React.useContext(UserContext);
  const draftActivities = useGetActivitiesAdminDraft({ limit: 2, isDraft: true });
  const publishedActivities = useGetActivitiesAdminDraft({ limit: 2, isDraft: false });

  const router = useRouter();

  useEffect(() => {
    if (user?.type === UserType.OBSERVATOR) {
      router.push('/admin/newportal/analyze');
    }
  }, [router, user]);
  if (draftActivities.isError) return <p>Error!</p>;
  if (draftActivities.isLoading || draftActivities.isIdle) return <p>Loading...</p>;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '80vw',
      }}
    >
      <h1>Publier</h1>
      <p>C’est dans cet espace, que les administrateurs et administratrices du site vont pouvoir gérer les publications sur 1VIllage.</p>
      <div style={{ margin: 10 }}>
        <ActivityCardAdminList
          title="Activités non publiées"
          activities={draftActivities.data}
          noDataText="Il n'y a aucune activitées non publiée"
          svgNoData={<PelicoStar style={{ height: '6rem', width: '6rem' }} />}
          buttonAction={() => router.push('/admin/newportal/publier/draft')}
        />
      </div>
      <div style={{ margin: 10 }}>
        <ActivityCardAdminList
          title="Activités publiées"
          activities={publishedActivities.data ?? []}
          noDataText="Aucune activitées n'a été publiée pour le moment"
          svgNoData={<PelicoVacances style={{ height: '6rem', width: '6rem' }} />}
          buttonAction={() => router.push('/admin/newportal/publier/published')}
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
