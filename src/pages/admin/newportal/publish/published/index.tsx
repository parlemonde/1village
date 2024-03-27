import Link from 'next/link';
import React from 'react';

import { useGetActivities } from 'src/api/activities/activities.get';
import AllActivitiesAdmin from 'src/components/activities/ActivityCard/activity-admin/AllActivitiesAdmin';
import BackArrow from 'src/svg/back-arrow.svg';

const Published = () => {
  const { data, isError, isIdle, isLoading } = useGetActivities({ limit: null, isDraft: false, isPelico: true });

  if (isError) return <p>Error!</p>;
  if (isLoading || isIdle) return <p>Loading...</p>;
  return (
    <div>
      <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
        <Link href="/admin/newportal/publish">
          <BackArrow />
        </Link>
        <p style={{ marginLeft: 10 }}>Activités publiées</p>
      </div>
      <AllActivitiesAdmin activities={data} />
    </div>
  );
};

export default Published;
