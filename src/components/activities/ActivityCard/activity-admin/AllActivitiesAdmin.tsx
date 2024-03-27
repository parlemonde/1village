import React, { useCallback, useState } from 'react';
import type { Activity } from 'server/entities/activity';

import type { SelectChangeEvent } from '@mui/material';

import PelicoNoContent from 'src/components/NoContentPelico';
import PaginationNav from 'src/components/PaginationNav/PaginationNav';
import ActivityCardAdmin from 'src/components/activities/ActivityCard/activity-admin/ActivityCardAdmin';

type Props = {
  activities: Activity[];
  search: string;
};

const AllActivitiesAdmin = ({ activities, search }: Props) => {
  // const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [activitiesPerPage, setActivitiesPerPage] = useState(10);
  const handleActivitiesPerPage = (e: SelectChangeEvent<string>) => {
    setPage(1);
    setActivitiesPerPage(parseInt(e.target.value));
  };
  const filteredActivities = useCallback(() => {
    return (
      activities
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
        .filter((_, i, arr) => {
          if (arr.length > activitiesPerPage) {
            return i >= page * activitiesPerPage - activitiesPerPage && i + 1 <= page * activitiesPerPage;
          } else {
            return true;
          }
        })
    );
  }, [activities, activitiesPerPage, page, search]);
  return (
    <div>
      <div className="admin-activity-card-list">
        {filteredActivities().map((activity) => (
          <ActivityCardAdmin key={activity.id} {...activity} />
        ))}
      </div>
      {filteredActivities().length ? (
        <PaginationNav
          page={page}
          itemsPerPage={activitiesPerPage}
          totalItems={activities.length}
          handlePage={(_, pageNum) => setPage(pageNum)}
          handleItemsPerPage={handleActivitiesPerPage}
        />
      ) : (
        <PelicoNoContent />
      )}
    </div>
  );
};

export default AllActivitiesAdmin;
