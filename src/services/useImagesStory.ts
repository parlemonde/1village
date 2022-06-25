import { useSnackbar } from 'notistack';
import React from 'react';
import { useQueryClient } from 'react-query';

import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';
import type { Activity } from 'types/activity.type';
import { ActivityType } from 'types/activity.type';
import type { StoriesData } from 'types/story.type';

export const useImageStories = () => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);

  // This function is to fetch all RE_INVENT_STORY in activity table page.
  const getAllStories = React.useCallback(
    async (imageId: number) => {
      if (!village) {
        return;
      }
      const response = await axiosLoggedRequest({
        method: 'GET',
        url: `/activities${serializeToQueryUrl({
          villageId: village?.id,
          type: ActivityType.RE_INVENT_STORY,
        })}`,
      });
      if (response.error && response.data) {
        return;
      }
      const stories = [] as Activity[];
      response.data.forEach((activity: Activity) => {
        const data = activity.data as StoriesData;
        if (data.object.imageId === imageId || data.place.imageId === imageId || data.odd.imageId === imageId) {
          stories.push(activity);
          return;
        }
      });

      return stories;
    },
    [axiosLoggedRequest, village],
  );

  // This function is to display story activity cards in activity page.
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

  // Fetch stories by their Id
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
      await Promise.all(
        activityStoryIds.map(async (activityStoryId) => {
          await getStoryData(activityStoryId).then((response) => stories.push(response.data));
        }),
      );
      return stories;
    },
    [axiosLoggedRequest, village],
  );

  // This is a function that returns random images for slot machine
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

  return { getAllStories, getInspiredStories, getStoriesByIds, getRandomImagesData };
};

export const useImageStoryRequests = () => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const { getAllStories } = useImageStories();
  const { activity, createNewActivity } = React.useContext(ActivityContext);

  const deleteStoryImage = React.useCallback(
    async (id: number | null, data: StoriesData, step?: number) => {
      if (!id) {
        return;
      }
      // This will return an array of used images.
      const storiesDatas = await getAllStories(id).catch();
      if (activity && storiesDatas && storiesDatas.length >= 1) {
        let newActivityData = {} as StoriesData;
        const imageData = {
          imageId: 0,
          imageUrl: '',
          inspiredStoryId: 0,
        };
        if (step === 1) {
          newActivityData = {
            ...data,
            object: {
              ...data.object,
              ...imageData,
            },
          };
        } else if (step === 2) {
          newActivityData = {
            ...data,
            place: {
              ...data.place,
              ...imageData,
            },
          };
        } else if (step === 3) {
          newActivityData = {
            ...data,
            odd: {
              ...data.odd,
              ...imageData,
            },
          };
        }
        createNewActivity(
          ActivityType.STORY,
          undefined,
          {
            ...newActivityData,
          },
          null,
          null,
          undefined,
        );
        //We exit the function because no delete is expected
        return;
      }
      const response = await axiosLoggedRequest({
        method: 'DELETE',
        url: `/stories/${id}`,
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
    [activity, axiosLoggedRequest, createNewActivity, enqueueSnackbar, getAllStories, queryClient],
  );

  return {
    deleteStoryImage,
  };
};
