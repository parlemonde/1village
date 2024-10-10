import { useCallback } from 'react';
import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { ClassroomsStats, SessionsStats } from 'types/statistics.type';

export const useStatisticsClassrooms = () => {
  const getStatisticsClassrooms = useCallback(async () => {
    const response = await axiosRequest({
      method: 'GET',
      url: '/statistics/classrooms',
    });
    if (response.error) {
      return;
    }
    return response.data;
  }, []);

  const { data, isLoading, error } = useQuery<ClassroomsStats[], unknown>(['classrooms'], getStatisticsClassrooms);

  return isLoading || error ? [] : data || [];
};

export const useStatisticsSessions = (villageId: number) => {
  const getStatisticsSessions = useCallback(async () => {
    const response = await axiosRequest({
      method: 'GET',
      url: `/statistics/sessions?villageId=${villageId}`,
    });
    if (response.error) {
      return;
    }
    return response.data;
  }, [villageId]);

  const { data, isLoading, error } = useQuery<SessionsStats[], unknown>(['session'], getStatisticsSessions, { enabled: !!villageId });

  return isLoading || error ? {} : data || {};
};
