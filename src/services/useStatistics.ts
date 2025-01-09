import { useCallback } from 'react';
import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { ClassroomsStats, SessionsStats } from 'types/statistics.type';

const generateUrl = (baseUrl: string, params: any): string => {
  const queryString = Object.keys(params)
    .filter((key) => params[key] !== undefined) // Exclure les paramètres undefined
    .map((key) => `${key}=${params[key]}`) // Créer les paires clé=valeur
    .join('&'); // Joindre avec '&'

  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

export const useStatisticsClassrooms = (villageId?: number | null, countryCode?: string | null, classroomId?: number | null) => {
  const getStatisticsClassrooms = useCallback(async () => {
    const url = generateUrl('/statistics/sessions', { villageId, countryCode, classroomId });
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
  }, [villageId, countryCode, classroomId]);

  const { data, isLoading, error } = useQuery<SessionsStats[], unknown>(['session', villageId, countryCode, classroomId], getStatisticsSessions);

  return isLoading || error ? {} : data || {};
};
