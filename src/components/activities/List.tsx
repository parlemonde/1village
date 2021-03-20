import React from 'react';

import type { FilterArgs } from 'src/components/accueil/Filters';
import { UserContext } from 'src/contexts/userContext';
import { useActivities } from 'src/services/useActivities';
import { useVillageUsers } from 'src/services/useVillageUsers';

import { ActivityCard } from './ActivityCard';

interface ActivitiesProps {
  filters?: FilterArgs;
}

const DEFAULT_FILTERS: FilterArgs = {
  type: 0,
  status: 0,
  pelico: true,
  countries: {},
};

export const Activities: React.FC<ActivitiesProps> = ({ filters = DEFAULT_FILTERS }: ActivitiesProps) => {
  const { user } = React.useContext(UserContext);
  const { activities } = useActivities({
    limit: 50,
    page: 0,
    countries: Object.keys(filters.countries).filter((key) => filters.countries[key]),
    pelico: filters.pelico,
    type: filters.type - 1,
  });
  const { users } = useVillageUsers();
  const userMap = React.useMemo(
    () =>
      users.reduce<{ [key: number]: number }>((acc, u, index) => {
        acc[u.id] = index;
        return acc;
      }, {}),
    [users],
  );

  return (
    <div>
      {activities.map((activity, index) => (
        <ActivityCard
          activity={activity}
          isSelf={user && activity.userId === user.id}
          user={userMap[activity.userId] !== undefined ? users[userMap[activity.userId]] : undefined}
          key={index}
        />
      ))}
    </div>
  );
};
