import React from 'react';
import type { QueryFunction } from 'react-query';
import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Currency } from 'types/currency.type';

export const useCurrencies = (): { currencies: Currency[] } => {
  const getCurrencies: QueryFunction<Currency[]> = React.useCallback(async () => {
    const response = await axiosRequest({
      method: 'GET',
      url: '/currencies',
    });
    if (response.error) {
      return [];
    }
    return response.data;
  }, []);
  const { data, isLoading, error } = useQuery<Currency[], unknown>(['currencies'], getCurrencies);

  return {
    currencies: isLoading || error ? [] : data || [],
  };
};
