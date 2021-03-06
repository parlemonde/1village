import { useQuery, QueryFunction } from 'react-query';
import React from 'react';

import { UserContext } from 'src/contexts/userContext';
import type { Video } from 'types/video.type';

export const useVideos = (): { videos: Video[] } => {
  const { axiosLoggedRequest } = React.useContext(UserContext);

  const getVideos: QueryFunction<Video[]> = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: '/videos',
    });
    if (response.error) {
      return [];
    }
    return response.data;
  }, [axiosLoggedRequest]);
  const { data, isLoading, error } = useQuery<Video[], unknown>(['videos'], getVideos);

  return {
    videos: isLoading || error ? [] : data,
  };
};
