import React from 'react';
import type { QueryFunction } from 'react-query';
import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Language } from 'types/language.type';

export const useLanguages = (): { languages: Language[] } => {
  const getLanguages: QueryFunction<Language[]> = React.useCallback(async () => {
    const response = await axiosRequest({
      method: 'GET',
      url: '/languages',
    });
    if (response.error) {
      return [];
    }
    return response.data;
  }, []);
  const { data, isLoading, error } = useQuery<Language[], unknown>(['languages'], getLanguages);

  return {
    languages: isLoading || error ? [] : data || [],
  };
};
