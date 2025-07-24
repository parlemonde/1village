import { useCallback } from 'react';
import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { ClassroomsStats, SessionsStats } from 'types/statistics.type';

/*const generateUrl = (baseUrl: string, params: any): string => {
  const queryString = Object.keys(params)
    .filter((key) => params[key] !== undefined)
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};*/

export const useStatisticsClassrooms = (
  villageId?: number | null,
  countryCode?: string | null,
  classroomId?: number | null,
  phase?: number | null,
) => {
  const getStatisticsClassrooms = useCallback(async () => {
    let url = '/statistics/sessions';
    const params = [];
    if (villageId !== null && villageId !== undefined) {
      params.push(`villageId=${villageId}`);
    }
    if (countryCode !== null && countryCode !== undefined) {
      params.push(`countryCode=${countryCode}`);
    }
    if (classroomId !== null && classroomId !== undefined) {
      params.push(`classroomId=${classroomId}`);
    }
    if (phase !== null && phase !== undefined) {
      params.push(`phase=${phase}`);
    }

    if (params) {
      // params.join('&');
      url += '?';
      url += params.join('&');
    }

    const response = await axiosRequest({
      method: 'GET',
      url,
    });
    if (response.error) {
      return null;
    }
    return response.data;
  }, [villageId, countryCode, classroomId, phase]);

  const { data, isLoading, error } = useQuery<ClassroomsStats>(['classrooms', villageId, countryCode, classroomId], getStatisticsClassrooms);

  return isLoading || error ? [] : data || [];
};

export const useStatisticsSessions = (villageId?: number | null, countryCode?: string | null, classroomId?: number | null, phase?: number | null) => {
  const getStatisticsSessions = useCallback(async () => {
    let url = '/statistics/sessions';
    const params = [];
    if (villageId !== null && villageId !== undefined) {
      params.push(`villageId=${villageId}`);
    }
    if (countryCode !== null && countryCode !== undefined) {
      params.push(`countryCode=${countryCode}`);
    }
    if (classroomId !== null && classroomId !== undefined) {
      params.push(`classroomId=${classroomId}`);
    }
    if (phase !== null && phase !== undefined) {
      params.push(`phase=${phase}`);
    }

    if (params) {
      // params.join('&');
      url += '?';
      url += params.join('&');
    }

    const response = await axiosRequest({
      method: 'GET',
      url,
    });
    if (response.error) {
      return null;
    }
    return response.data;
  }, [villageId, countryCode, classroomId, phase]);

  const { data, isLoading, error } = useQuery<SessionsStats[], unknown>(
    ['session', villageId, countryCode, classroomId, phase],
    getStatisticsSessions,
    {
      staleTime: 0,
      cacheTime: 0,
      refetchOnMount: true,
    },
  );

  return isLoading || error ? {} : data || {};
};
