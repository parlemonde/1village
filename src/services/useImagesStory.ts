import React from 'react';

import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';
import type { Activity } from 'types/activity.type';
import { ActivityType } from 'types/activity.type';
import type { StoriesData } from 'types/story.type';

export const useImageStoryRequests = () => {
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

  const getStoriesFromIds = React.useCallback(
    async (activityStoryIds: number[]) => {
      if (!village) {
        return;
      }
      const stories = [] as Activity[];
      activityStoryIds.forEach(async (activityStoryId) => {
        await axiosLoggedRequest({
          method: 'GET',
          url: `/activities/${activityStoryId}`,
        }).then((response) => stories.push(response.data));
      });
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

  return { getInspiredStories, getStoriesFromIds, getRandomImagesData };
};
