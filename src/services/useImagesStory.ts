import React from 'react';

import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';
import type { StoriesData } from 'types/story.type';

export const useImageStoryRequests = () => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);

  const getRandomImagesStory = React.useCallback(async () => {
    if (!village) {
      return 0;
    }
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: `/stories${serializeToQueryUrl({
        villageId: village.id,
      })}`,
    });
    if (response.error) {
      return 0;
    }
    return response.data;
  }, [axiosLoggedRequest, village]);

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

  return { getRandomImagesStory, getRandomImagesData };
};
