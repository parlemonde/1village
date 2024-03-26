import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import { useGetActivities } from 'src/api/activities/activities.get';
import ActivityCardAdmin from 'src/components/activities/ActivityCard/activity-admin/ActivityCardAdmin';
import BackArrow from 'src/svg/back-arrow.svg';

const AllDaft = () => {
  const { data, isError, isIdle, isLoading } = useGetActivities({ limit: null, isDraft: true, isPelico: true });
  const router = useRouter();

  if (isError) return <p>Error!</p>;
  if (isLoading || isIdle) return <p>Loading...</p>;
  return (
    <div>
      <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
        <Link href="/admin/newportal/publish">
          <BackArrow />
        </Link>
        <p>Activités publiées</p>
      </div>
      <div className="admin-activity-card-list">
        {data.map((activity) => (
          <ActivityCardAdmin key={activity.id} {...activity} />
        ))}
      </div>
    </div>
  );
};

export default AllDaft;
