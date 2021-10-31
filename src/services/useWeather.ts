import type { QueryFunction } from 'react-query';
import { useQuery } from 'react-query';
import React from 'react';

import { UserContext } from 'src/contexts/userContext';
import { getMapPosition } from 'src/utils/getMapPosition';
import { serializeToQueryUrl } from 'src/utils';
import type { User } from 'types/user.type';
import type { Weather } from 'types/weather.type';

export const useWeather = ({ activityUser }: { activityUser: User }): Weather | null => {
  const { axiosLoggedRequest } = React.useContext(UserContext);

  const getWeather: QueryFunction<Weather | null> = React.useCallback(async () => {
    if (!activityUser) {
      return null;
    }

    const pos = await getMapPosition(activityUser);
    if (!pos) {
      return null;
    }

    const response = await axiosLoggedRequest({
      method: 'GET',
      url: `/weather${serializeToQueryUrl({
        latitude: pos[0],
        longitude: pos[1],
      })}`,
    });
    return response.error ? null : (response.data as Weather);
  }, [activityUser, axiosLoggedRequest]);
  const { data, isLoading, error } = useQuery<Weather | null, unknown>(
    ['weather', { userId: activityUser ? activityUser.id : undefined }],
    getWeather,
  );

  if (isLoading || error) {
    return null;
  }
  return data || null;
};
