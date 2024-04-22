import { useQuery } from 'react-query';
import type { Country } from 'server/entities/country';

import { axiosRequest } from 'src/utils/axiosRequest';

async function getCountries(): Promise<Country[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/countries',
    })
  ).data;
}

export const useGetCountries = () => {
  return useQuery(['countries'], () => getCountries());
};
