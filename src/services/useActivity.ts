import { useSnackbar } from 'notistack';
import React from 'react';
import type { QueryFunction } from 'react-query';
import { useQueryClient, useQuery } from 'react-query';

import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { Activity, AnyData } from 'types/activity.type';

export const useActivity = (activityId: number): { activity: Activity | null } => {
  const { village } = React.useContext(VillageContext);

  const villageId = village ? village.id : null;

  const getActivity: QueryFunction<Activity | null> = React.useCallback(async () => {
    if (activityId === -1) {
      return null;
    }
    if (!villageId) {
      return null;
    }
    const response = await axiosRequest({
      method: 'GET',
      url: `/activities/${activityId}${serializeToQueryUrl({ villageId })}`,
    });
    if (response.error) {
      return null;
    }
    return response.data as Activity;
  }, [villageId, activityId]);
  const { data, isLoading, error } = useQuery<Activity | null, unknown>(['activity', { villageId, activityId }], getActivity);

  return {
    activity: isLoading || error ? null : data || null,
  };
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useActivityRequests = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const updatedActivityData = React.useCallback(
    async (activity: Activity, data: AnyData) => {
      const response = await axiosRequest({
        method: 'PUT',
        url: `/activities/${activity.id}`,
        data: {
          data,
        },
      });
      if (response.error) {
        enqueueSnackbar('Une erreur est survenue...', {
          variant: 'error',
        });
        return;
      }
      queryClient.invalidateQueries('activity');
      queryClient.invalidateQueries('activities');
    },
    [enqueueSnackbar, queryClient],
  );

  const askSameQuestion = React.useCallback(
    async (activityId: number) => {
      const response = await axiosRequest({
        method: 'PUT',
        url: `/activities/${activityId}/askSame`,
      });
      if (response.error) {
        enqueueSnackbar('Une erreur est survenue...', {
          variant: 'error',
        });
        return;
      }
      queryClient.invalidateQueries('activity');
      queryClient.invalidateQueries('activities');
    },
    [enqueueSnackbar, queryClient],
  );

  const deleteActivity = React.useCallback(
    async (id: number, isDraft?: boolean) => {
      const response = await axiosRequest({
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
      queryClient.invalidateQueries('activity');
      queryClient.invalidateQueries('activities');
    },
    [queryClient, enqueueSnackbar],
  );

  return {
    updatedActivityData,
    askSameQuestion,
    deleteActivity,
  };
};
