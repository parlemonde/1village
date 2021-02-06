import { useQuery, QueryFunction } from 'react-query';
import React from 'react';

import { ExtendedActivity } from 'src/components/activities/editing.types';
import { getExtendedActivity } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';

export const useActivity = (activityId: number): { activity: ExtendedActivity | null } => {
  const { village } = React.useContext(VillageContext);
  const { axiosLoggedRequest } = React.useContext(UserContext);

  const villageId = village ? village.id : null;

  const getActivity: QueryFunction<ExtendedActivity | null> = React.useCallback(async () => {
    if (!villageId) {
      return null;
    }
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: `/activities/${activityId}${serializeToQueryUrl({ villageId })}`,
    });
    if (response.error) {
      return null;
    }
    return getExtendedActivity(response.data);
  }, [villageId, activityId, axiosLoggedRequest]);
  const { data, isLoading, error } = useQuery<ExtendedActivity | null, unknown>(['activity', { villageId, activityId }], getActivity);

  return {
    activity: isLoading || error ? null : data,
  };
};
