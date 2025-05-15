import React from 'react';
import type { QueryFunction } from 'react-query';
import { useQueryClient, useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Classroom, ClassroomFilter } from 'types/classroom.type';

export const useClassrooms = (options?: ClassroomFilter): { classrooms: Classroom[]; setClassrooms(newClassrooms: Classroom[]): void } => {
  const queryClient = useQueryClient();
  const buildUrl = () => {
    if (!options) return '/classrooms';
    const { villageId } = options;
    const queryParams = [];

    if (villageId) queryParams.push(`villageId=${villageId}`);

    return queryParams.length ? `/classrooms?${queryParams.join('&')}` : '/classrooms';
  };

  const url = buildUrl();
  // The query function for fetching villages, memoized with useCallback
  const getClassrooms: QueryFunction<Classroom[]> = React.useCallback(async () => {
    const response = await axiosRequest({
      method: 'GET',
      url,
    });
    if (response.error) {
      return [];
    }
    return response.data;
  }, [url]);

  // Notice that we include `countryIsoCode` in the query key so that the query is refetched
  const { data, isLoading, error } = useQuery<Classroom[], unknown>(
    ['classrooms', options], // Include countryIsoCode in the query key to trigger refetching
    getClassrooms,
  );

  const setClassrooms = React.useCallback(
    (newClassrooms: Classroom[]) => {
      queryClient.setQueryData(['classrooms', options], newClassrooms); // Ensure that the query key includes countryIsoCode
    },
    [queryClient, options],
  );

  return {
    classrooms: isLoading || error ? [] : data || [],
    setClassrooms,
  };
};
