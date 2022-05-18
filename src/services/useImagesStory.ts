import { useSnackbar } from 'notistack';
import { useQueryClient, useQuery } from 'react-query';
import React from 'react';

import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';
import type { Activity } from 'types/activity.type';
import { ActivityType } from 'types/activity.type';
import type { StoriesData } from 'types/story.type';

export const useImageStories = () => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);

  const getInspiredStories = React.useCallback(
    async (activityStoryId: number) => {
      if (!village) {
        return 0;
      }
      const response = await axiosLoggedRequest({
        method: 'GET',
        url: `/activities${serializeToQueryUrl({
          villageId: village?.id,
          type: ActivityType.STORY + ',' + ActivityType.RE_INVENT_STORY,
        })}`,
      });
      if (response.error && response.data) {
        return 0;
      }
      const stories = [] as Activity[];
      response.data.forEach((activity: Activity) => {
        const data = activity.data as StoriesData;
        if (
          data.object.inspiredStoryId === activityStoryId ||
          data.place.inspiredStoryId === activityStoryId ||
          data.odd.inspiredStoryId === activityStoryId
        ) {
          stories.push(activity);
        }
      });
      return stories.filter((activity: Activity) => activity.id !== activityStoryId);
    },
    [axiosLoggedRequest, village],
  );

  const getStoriesByIds = React.useCallback(
    async (activityStoryIds: number[]) => {
      if (!village) {
        return;
      }
      const getStoryData = async (id: number) =>
        await axiosLoggedRequest({
          method: 'GET',
          url: `/activities/${id}`,
        });
      const stories = [] as Activity[];
      // https://advancedweb.hu/how-to-use-async-functions-with-array-foreach-in-javascript/
      await Promise.all(
        activityStoryIds.map(async (activityStoryId) => {
          await getStoryData(activityStoryId).then((response) => stories.push(response.data));
        }),
      );
      return stories;
    },
    [axiosLoggedRequest, village],
  );

  const getRandomImagesData = React.useCallback(async () => {
    if (!village) {
      return 0;
    }
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: `/stories/all${serializeToQueryUrl({
        villageId: village.id,
      })}`,
    });
    if (response.error) {
      return 0;
    }
    return response.data;
  }, [axiosLoggedRequest, village]);

  return { getInspiredStories, getStoriesByIds, getRandomImagesData };
};

export const useImageStoryRequests = (activityId: number | null) => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  const deleteStoryImage = React.useCallback(
    async (id: number) => {
      if (!id) {
        return;
      }
      const response = await axiosLoggedRequest({
        method: 'DELETE',
        url: `/activities/${activityId}/stories/${id}`,
      });
      if (response.error) {
        enqueueSnackbar('Une erreur est survenue...', {
          variant: 'error',
        });
        return;
      }
      queryClient.invalidateQueries('stories');
      queryClient.invalidateQueries('activities');
    },
    [activityId, axiosLoggedRequest, enqueueSnackbar, queryClient],
  );

  return {
    deleteStoryImage,
  };
};
