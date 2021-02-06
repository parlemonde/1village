import React from 'react';

import type { FilterArgs } from 'src/components/accueil/Filters';
import { ExtendedActivity } from 'src/components/activities/editing.types';
import { UserContext } from 'src/contexts/userContext';
import { useActivities } from 'src/services/useActivities';
import { useVillageUsers } from 'src/services/useVillageUsers';
import { UserType } from 'types/user.type';

import { ActivityCard } from './ActivityCard';

interface ActivitiesProps {
  onlySelf?: boolean;
  filters?: FilterArgs;
}

const DEFAULT_FILTERS: FilterArgs = {
  type: 0,
  status: 0,
  pelico: true,
  countries: {},
};

export const Activities: React.FC<ActivitiesProps> = ({ onlySelf = false, filters = DEFAULT_FILTERS }: ActivitiesProps) => {
  const { user } = React.useContext(UserContext);
  const { activities } = useActivities();
  const { users } = useVillageUsers();
  const userMap = React.useMemo(
    () =>
      users.reduce<{ [key: number]: number }>((acc, u, index) => {
        acc[u.id] = index;
        return acc;
      }, {}),
    [users],
  );

  const activityFilter = React.useCallback(
    (activity: ExtendedActivity): boolean => {
      const activityUser = userMap[activity.userId] !== undefined ? users[userMap[activity.userId]] : undefined;
      if (!activityUser) {
        return false;
      }
      const userIsPelico = activityUser.type >= UserType.MEDIATOR;
      if (!filters.pelico && userIsPelico) {
        return false;
      }
      if (filters.type > 0 && activity.type !== filters.type - 1) {
        return false;
      }
      if (!userIsPelico && Object.keys(filters.countries).length > 0 && !filters.countries[activityUser.countryCode.toUpperCase()]) {
        return false;
      }
      return true;
    },
    [filters, userMap, users],
  );

  const userId = user ? user.id : null;
  const filteredActivities = React.useMemo(() => {
    if (!onlySelf) {
      return activities.filter(activityFilter);
    }
    if (userId === null) {
      return [];
    }
    return activities.filter((a) => a.userId === userId).filter(activityFilter);
  }, [onlySelf, userId, activities, activityFilter]);

  return (
    <div>
      {filteredActivities.map((activity, index) => (
        <ActivityCard
          activity={activity}
          isSelf={user && activity.userId === user.id}
          user={userMap[activity.userId] !== undefined ? users[userMap[activity.userId]] : undefined}
          key={index}
          showEditButtons={onlySelf}
        />
      ))}
    </div>
  );
};
