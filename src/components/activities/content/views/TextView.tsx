import React, { useContext } from 'react';

import { ActivityCard } from '../../ActivityCard';
import type { ViewProps } from '../content.types';
import { UserContext } from 'src/contexts/userContext';
import { useActivity } from 'src/services/useActivity';
import { useVillageUsers } from 'src/services/useVillageUsers';

export const TextView = ({ value }: ViewProps) => {
  const { user } = useContext(UserContext);
  const { users } = useVillageUsers();

  const regex = /<\/?p>/g;
  const data = value && value.includes('/activite/') ? value.replace(regex, '').split('/') : null;
  const activityIdEmbed = data?.[data.length - 1];
  const { activity } = useActivity(activityIdEmbed ? Number(activityIdEmbed) : -1);

  const userMap = React.useMemo(
    () =>
      users.reduce<{ [key: number]: number }>((acc, u, index) => {
        acc[u.id] = index;
        return acc;
      }, {}),
    [users],
  );

  return (
    <>
      {activity && user && users ? (
        <ActivityCard activity={activity} isSelf={activity.userId === user.id} user={users[userMap[activity.userId]]} />
      ) : (
        ''
      )}
      <div className="activity-data">
        <div dangerouslySetInnerHTML={{ __html: value && !value.includes('/activite/') ? value : '' }} className="break-long-words" />
      </div>
    </>
  );
};
