import React from 'react';
import type { QueryFunction } from 'react-query';
import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Country } from 'types/country.type';

export const useCountries = (): { countries: Country[] } => {
  const getCountries: QueryFunction<Country[]> = React.useCallback(async () => {
    const response = await axiosRequest({
      method: 'GET',
      url: '/countries',
    });
    if (response.error) {
      return [];
    }
    return response.data;
  }, []);
  const { data, isLoading, error } = useQuery<Country[], unknown>(['countries'], getCountries);

  return {
    countries: isLoading || error ? [] : data || [],
  };
};
