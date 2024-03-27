import Link from 'next/link';
import React, { useState } from 'react';

import { useGetActivities } from 'src/api/activities/activities.get';
import SearchField from 'src/components/SearchField';
import AllActivitiesAdmin from 'src/components/activities/ActivityCard/activity-admin/AllActivitiesAdmin';
import BackArrow from 'src/svg/back-arrow.svg';

const AllDaft = () => {
  const [search, setSearch] = useState('');
  const { data, isError, isIdle, isLoading } = useGetActivities({ limit: null, isDraft: true, isPelico: true });
  if (isError) return <p>Error!</p>;
  if (isLoading || isIdle) return <p>Loading...</p>;
  return (
    <div>
      <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
        <Link href="/admin/newportal/publish">
          <BackArrow />
        </Link>
        <p style={{ marginLeft: 10 }}>Activités non publiées</p>
      </div>
      <div style={{ width: '40%' }}>
        <SearchField setter={(e) => setSearch(e.currentTarget.value)} />
      </div>
      <AllActivitiesAdmin activities={data} search={search} />
    </div>
  );
};

export default AllDaft;
