import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Currency } from 'types/currency.type';

export const getCurrencies = async (): Promise<Currency[]> => {
  const response = await axiosRequest({
    method: 'GET',
    url: '/currencies',
  });
  if (response.error) {
    return [];
  }
  return response.data;
};

export const useCurrencies = (): { currencies: Currency[] } => {
  const { data, isLoading, error } = useQuery<Currency[], unknown>(['currencies'], getCurrencies);

  return {
    currencies: isLoading || error ? [] : data || [],
  };
};
