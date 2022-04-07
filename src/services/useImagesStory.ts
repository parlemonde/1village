import React from 'react';

import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';
import type { ImageType } from 'types/story.type';

export const useImageStoryRequests = () => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);

  const getAvailableImageStoryCount = React.useCallback(
    async (type: ImageType) => {
      if (!village) {
        return 0;
      }
      const response = await axiosLoggedRequest({
        method: 'GET',
        url: `/images/ableToSpin${serializeToQueryUrl({
          villageId: village.id,
          type,
        })}`,
      });
      if (response.error) {
        return 0;
      }
      return response.data.count as number;
    },
    [axiosLoggedRequest, village],
  );

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

  return { getRandomImagesStory, getAvailableImageStoryCount };
};
