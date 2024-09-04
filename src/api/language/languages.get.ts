import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Language } from 'types/language.type';

export const getLanguages = async (): Promise<Language[]> => {
  const response = await axiosRequest({
    method: 'GET',
    url: '/languages',
  });
  if (response.error) {
    return [];
  }
  return response.data;
};

export const useLanguages = (): { languages: Language[] } => {
  const { data, isLoading, error } = useQuery<Language[], unknown>(['languages'], getLanguages);

  return {
    languages: isLoading || error ? [] : data || [],
  };
};
