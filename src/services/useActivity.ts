import { useSnackbar } from 'notistack';
import { useQueryCache, useQuery, QueryFunction } from 'react-query';
import React from 'react';

import { ExtendedActivity, ExtendedActivityData } from 'src/components/activities/editing.types';
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

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useActivityRequests = () => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const queryCache = useQueryCache();
  const { enqueueSnackbar } = useSnackbar();

  const updatedActivityData = React.useCallback(
    async (activity: ExtendedActivity, data: ExtendedActivityData) => {
      const response = await axiosLoggedRequest({
        method: 'PUT',
        url: `/activities/${activity.id}/content/${activity.dataId}`,
        data: {
          value: JSON.stringify({
            type: 'data',
            data,
          }),
        },
      });
      if (response.error) {
        enqueueSnackbar('Une erreur est survenue...', {
          variant: 'error',
        });
        return;
      }
      queryCache.invalidateQueries('activity');
      queryCache.invalidateQueries('activities');
    },
    [axiosLoggedRequest, enqueueSnackbar, queryCache],
  );

  const deleteActivity = React.useCallback(
    async (id: number) => {
      const response = await axiosLoggedRequest({
        method: 'DELETE',
        url: `/activities/${id}`,
      });
      if (response.error) {
        enqueueSnackbar('Une erreur est survenue...', {
          variant: 'error',
        });
        return;
      }
      enqueueSnackbar('Activité supprimée avec succès!', {
        variant: 'success',
      });
      queryCache.invalidateQueries('activity');
      queryCache.invalidateQueries('activities');
    },
    [axiosLoggedRequest, queryCache, enqueueSnackbar],
  );

  return {
    updatedActivityData,
    deleteActivity,
  };
};
