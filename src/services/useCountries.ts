import type { QueryFunction } from 'react-query';
import { useQuery } from 'react-query';
import React from 'react';

import { UserContext } from 'src/contexts/userContext';
import type { Country } from 'types/country.type';

export const useCountries = (): { countries: Country[] } => {
  const { axiosLoggedRequest } = React.useContext(UserContext);

  const getCountries: QueryFunction<Country[]> = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: '/countries',
    });
    if (response.error) {
      return [];
    }
    return response.data;
  }, [axiosLoggedRequest]);
  const { data, isLoading, error } = useQuery<Country[], unknown>(['countries'], getCountries);

  return {
    countries: isLoading || error ? [] : data,
  };
};
