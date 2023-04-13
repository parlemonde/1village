import React from 'react';
import type { QueryFunction } from 'react-query';
import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Video } from 'types/video.type';

export const useVideos = (): { videos: Video[] } => {
  const getVideos: QueryFunction<Video[]> = React.useCallback(async () => {
    const response = await axiosRequest({
      method: 'GET',
      url: '/videos',
    });
    if (response.error) {
      return [];
    }
    return response.data;
  }, []);
  const { data, isLoading, error } = useQuery<Video[], unknown>(['videos'], getVideos);

  return {
    videos: isLoading || error ? [] : data || [],
  };
};
