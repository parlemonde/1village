import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

import { useGetActivities } from 'src/api/activities/activities.get';
import ActivityCardAdminList from 'src/components/activities/ActivityCard/activity-admin/ActivityCardAdminList';
import { UserContext } from 'src/contexts/userContext';
import PelicoStar from 'src/svg/pelico/pelico_star.svg';
import PelicoVacances from 'src/svg/pelico/pelico_vacances.svg';
import { UserType } from 'types/user.type';

const Publier = () => {
  const { user } = React.useContext(UserContext);
  const draftActivities = useGetActivities({ limit: 2, isDraft: true, isPelico: true });
  const publishedActivities = useGetActivities({ limit: 2, isDraft: false, isPelico: true });
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
        maxWidth: '60vw',
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
          buttonAction={() => router.push('/admin/newportal/publish/draft')}
        />
      </div>
      <div style={{ margin: 10 }}>
        <ActivityCardAdminList
          title="Activités publiées"
          activities={publishedActivities.data ?? []}
          noDataText="Aucune activitées n'a été publiée pour le moment"
          svgNoData={<PelicoVacances style={{ height: '6rem', width: '6rem' }} />}
          buttonAction={() => router.push('/admin/newportal/publish/published')}
        />
      </div>
    </div>
  );
};

export default Publier;
