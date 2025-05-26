import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Country } from 'types/country.type';

const getCountriesWithVillages = async (): Promise<Country[]> => {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/countries/present',
    })
  ).data;
};

export const useGetCountriesWithVillages = () => {
  return useQuery(['countries-present'], () => getCountriesWithVillages());
};
