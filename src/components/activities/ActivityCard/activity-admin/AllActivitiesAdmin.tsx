import React, { useState } from 'react';
import type { Activity } from 'server/entities/activity';

import SearchField from 'src/components/SearchField';
import ActivityCardAdmin from 'src/components/activities/ActivityCard/activity-admin/ActivityCardAdmin';

type Props = {
  activities: Activity[];
};

const AllActivitiesAdmin = ({ activities }: Props) => {
  const [search, setSearch] = useState('');
  return (
    <div>
      <div style={{ width: '40%' }}>
        <SearchField setter={(e) => setSearch(e.currentTarget.value)} />
      </div>
      <div className="admin-activity-card-list">
        {activities
          .filter((activity) => {
            if (search.length) {
              // content filter
              const title: string = activity?.data?.title ? (activity.data.title as string) : '';
              return activity.content
                .reduce((acc, curr) => {
                  if (curr.type === 'text') {
                    acc += curr.value;
                  }
                  return acc;
                }, '')
                .concat(` ${title}`)
                .toLocaleLowerCase()
                .includes(search.toLowerCase());
            } else {
              return true;
            }
          })
          .map((activity) => (
            <ActivityCardAdmin key={activity.id} {...activity} />
          ))}
      </div>
    </div>
  );
};

export default AllActivitiesAdmin;
