import { useCallback } from 'react';
import type { QueryFunction } from 'react-query';
import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Country } from 'types/country.type';

export const useCountries = (params?: { hasVillage: boolean }): { countries: Country[]; isLoading: boolean; error: unknown } => {
  const getCountries: QueryFunction<Country[]> = useCallback(async () => {
    try {
      const response = await axiosRequest({
        method: 'GET',
        url: '/countries',
        params,
      });

      if (response.error) {
        console.error('[useCountries] Error fetching countries:', response.error);
        return [];
      }

      return response.data;
    } catch (err) {
      console.error('[useCountries] Failed to fetch countries:', err);
      throw err;
    }
  }, [params]);

  const { data, isLoading, error } = useQuery<Country[], unknown>(['countries', params], getCountries, {
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: 2,
  });

  return {
    countries: data || [],
    isLoading,
    error,
  };
};
