import { useSnackbar } from 'notistack';
import { useQueryCache, useQuery, QueryFunction } from 'react-query';
import React from 'react';

import { AnyActivity, AnyActivityData } from 'src/activity-types/anyActivities.types';
import { getAnyActivity } from 'src/activity-types/anyActivity';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';

export const useActivity = (activityId: number): { activity: AnyActivity | null } => {
  const { village } = React.useContext(VillageContext);
  const { axiosLoggedRequest } = React.useContext(UserContext);

  const villageId = village ? village.id : null;

  const getActivity: QueryFunction<AnyActivity | null> = React.useCallback(async () => {
    if (activityId === -1) {
      return null;
    }
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
    return getAnyActivity(response.data);
  }, [villageId, activityId, axiosLoggedRequest]);
  const { data, isLoading, error } = useQuery<AnyActivity | null, unknown>(['activity', { villageId, activityId }], getActivity);

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
    async (activity: AnyActivity, data: AnyActivityData) => {
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
    async (id: number, isDraft?: boolean) => {
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
      enqueueSnackbar(isDraft ? 'Brouillon supprimé avec succès!' : 'Activité supprimée avec succès!', {
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
