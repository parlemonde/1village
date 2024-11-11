import { useCallback } from 'react';
import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { ClassroomsStats, SessionsStats } from 'types/statistics.type';

export const useStatisticsClassrooms = (villageId?: number | null, countryCode?: string | null, classroomId?: number | null) => {
  const getStatisticsClassrooms = useCallback(async () => {
    let url = '/statistics/classrooms';
    if (villageId) {
      url += `?villageId=${villageId}`;
    } else if (countryCode) {
      url += `?countryCode=${countryCode}`;
    } else if (classroomId) {
      url += `?classroomId=${classroomId}`;
    }
    const response = await axiosRequest({
      method: 'GET',
      url: url,
    });
    if (response.error) {
      return;
    }
    return response.data;
  }, [villageId, countryCode, classroomId]);

  const { data, isLoading, error } = useQuery<ClassroomsStats>(['classrooms', villageId, countryCode, classroomId], getStatisticsClassrooms);

  return isLoading || error ? [] : data || [];
};

export const useStatisticsSessions = (villageId?: number | null, countryCode?: string | null, classroomId?: number | null) => {
  const getStatisticsSessions = useCallback(async () => {
    let url = '/statistics/sessions';
    if (villageId) {
      url += `?villageId=${villageId}`;
    } else if (countryCode) {
      url += `?countryCode=${countryCode}`;
    } else if (classroomId) {
      url += `?classroomId=${classroomId}`;
    }

    const response = await axiosRequest({
      method: 'GET',
      url,
    });
    if (response.error) {
      return null;
    }
    return response.data;
  }, [villageId, countryCode, classroomId]);

  const { data, isLoading, error } = useQuery<SessionsStats[], unknown>(['session', villageId, countryCode, classroomId], getStatisticsSessions);

  return isLoading || error ? {} : data || {};
};
