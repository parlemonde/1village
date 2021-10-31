import type { QueryFunction } from 'react-query';
import { useQuery } from 'react-query';
import React from 'react';

import { UserContext } from 'src/contexts/userContext';
import type { Language } from 'types/language.type';

export const useLanguages = (): { languages: Language[] } => {
  const { axiosLoggedRequest } = React.useContext(UserContext);

  const getLanguages: QueryFunction<Language[]> = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: '/languages',
    });
    if (response.error) {
      return [];
    }
    return response.data;
  }, [axiosLoggedRequest]);
  const { data, isLoading, error } = useQuery<Language[], unknown>(['languages'], getLanguages);

  return {
    languages: isLoading || error ? [] : data || [],
  };
};
