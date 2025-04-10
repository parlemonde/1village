import Link from 'next/link';
import React, { useState } from 'react';
import type { Activity } from 'server/entities/activity';

import { useGetActivitiesAdminDraft } from 'src/api/activities/activities.admin.get';
import { useGetVillages } from 'src/api/villages/villages.get';
import SearchField from 'src/components/SearchField';
import type { Option } from 'src/components/accueil/Filters/FilterSelect';
// import { FilterSelect } from 'src/components/accueil/Filters/FilterSelect';
import AllActivitiesAdmin from 'src/components/activities/ActivityCard/activity-admin/AllActivitiesAdmin';
import BackArrow from 'src/svg/back-arrow.svg';

const Published = () => {
  const [search, setSearch] = useState('');
  const [selectedVillage] = useState<Option<number> | null>(null);
  const { data, isError, isIdle, isLoading } = useGetActivitiesAdminDraft({ limit: null, isDraft: false, isDisplayed: false });
  const villages = useGetVillages();
  function filterActivitiesByVillage(selectedVillage: Option<number> | null, activities: Activity[]) {
    if (selectedVillage && selectedVillage.label !== 'Tous') {
      return activities.filter((activity) => activity.villageId === selectedVillage.value);
    } else {
      return activities;
    }
  }
  if (isError || villages.isError) return <p>Error!</p>;
  if (isLoading || isIdle || villages.isLoading || villages.isIdle) return <p>Loading...</p>;
  return (
    <div>
      <Link href="/admin/newportal/publier">
        <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'left', alignItems: 'center' }}>
          <BackArrow />
          <h1 style={{ marginLeft: 10 }}>Activités publiées</h1>
        </div>
      </Link>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div>
          {/* <FilterSelect
            name="Village - Monde"
            onChange={(e: Option<number>) => setSelectedVillage(e)}
            options={villages.data.reduce<Array<Option<number>>>((acc, village, i) => {
              if (i === 0) {
                acc.push({ key: 0, label: `Tous`, value: 'all' });
              }
              acc.push({ key: i + 1, label: village.name, value: village.id });
              return acc;
            }, [])}
            value={selectedVillage ? selectedVillage.key : 0}
          /> */}
        </div>
        <div style={{ width: '40%', marginTop: 20 }}>
          <SearchField setter={(e) => setSearch(e.currentTarget.value)} />
        </div>
      </div>
      <AllActivitiesAdmin activities={filterActivitiesByVillage(selectedVillage, data)} search={search} />
    </div>
  );
};

export default Published;
