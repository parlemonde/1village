import React, { useState } from 'react';
import type { Activity } from 'server/entities/activity';

import type { SelectChangeEvent } from '@mui/material';

import PaginationNav from 'src/components/PaginationNav/PaginationNav';
import SearchField from 'src/components/SearchField';
import ActivityCardAdmin from 'src/components/activities/ActivityCard/activity-admin/ActivityCardAdmin';

type Props = {
  activities: Activity[];
};

const AllActivitiesAdmin = ({ activities }: Props) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [activitiesPerPage, setActivitiesPerPage] = useState(25);
  const handleActivitiesPerPage = (e: SelectChangeEvent<string>) => {
    setPage(1);
    setActivitiesPerPage(parseInt(e.target.value));
  };
  return (
    <div>
      <div style={{ width: '40%' }}>
        <SearchField setter={(e) => setSearch(e.currentTarget.value)} />
      </div>
      <div className="admin-activity-card-list">
        {activities
          //filter on search
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
          // map array + filter by pages
          .map((activity, i, arr) => {
            if (arr.length > activitiesPerPage) {
              if (i >= page * activitiesPerPage - activitiesPerPage && i + 1 <= page * activitiesPerPage) {
                return <ActivityCardAdmin key={activity.id} {...activity} />;
              }
              return;
            } else {
              return <ActivityCardAdmin key={activity.id} {...activity} />;
            }
          })}
      </div>
      <PaginationNav
        page={page}
        itemsPerPage={activitiesPerPage}
        totalItems={activities.length}
        handlePage={(_, pageNum) => setPage(pageNum)}
        handleItemsPerPage={handleActivitiesPerPage}
      />
    </div>
  );
};

export default AllActivitiesAdmin;
