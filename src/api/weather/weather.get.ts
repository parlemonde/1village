import { useQuery } from 'react-query';

import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { Weather } from 'types/weather.type';

type GET_WEATHER_PARAMS = {
  latitude: number;
  longitude: number;
};
type GET_WEATHER_RESPONSE = Weather;

export async function getWeather({ latitude, longitude }: GET_WEATHER_PARAMS) {
  const response = await axiosRequest<GET_WEATHER_RESPONSE>({
    method: 'GET',
    url: `/weather${serializeToQueryUrl({
      latitude,
      longitude,
    })}`,
  });
  return response.error ? undefined : response.data;
}

export function useWeather({ latitude, longitude }: GET_WEATHER_PARAMS) {
  return useQuery(['weather', { latitude, longitude }], () => getWeather({ latitude, longitude }));
}
