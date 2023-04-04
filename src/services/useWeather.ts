import React from 'react';
import type { QueryFunction } from 'react-query';
import { useQuery } from 'react-query';

import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { User } from 'types/user.type';
import type { Weather } from 'types/weather.type';

export const useWeather = ({ activityUser }: { activityUser: User }): Weather | null => {
  const getWeather: QueryFunction<Weather | null> = React.useCallback(async () => {
    if (!activityUser) {
      return null;
    }

    const response = await axiosRequest({
      method: 'GET',
      url: `/weather${serializeToQueryUrl({
        latitude: activityUser.position.lat,
        longitude: activityUser.position.lng,
      })}`,
    });
    return response.error ? null : (response.data as Weather);
  }, [activityUser]);
  const { data, isLoading, error } = useQuery<Weather | null, unknown>(
    ['weather', { userId: activityUser ? activityUser.id : undefined }],
    getWeather,
  );

  if (isLoading || error) {
    return null;
  }
  return data || null;
};
