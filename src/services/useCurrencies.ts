import React from 'react';
import type { QueryFunction } from 'react-query';
import { useQuery } from 'react-query';

import { UserContext } from 'src/contexts/userContext';
import type { Currency } from 'types/currency.type';

export const useCurrencies = (): { currencies: Currency[] } => {
  const { axiosLoggedRequest } = React.useContext(UserContext);

  const getCurrencies: QueryFunction<Currency[]> = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: '/currencies',
    });
    if (response.error) {
      return [];
    }
    return response.data;
  }, [axiosLoggedRequest]);
  const { data, isLoading, error } = useQuery<Currency[], unknown>(['currencies'], getCurrencies);

  return {
    currencies: isLoading || error ? [] : data || [],
  };
};
