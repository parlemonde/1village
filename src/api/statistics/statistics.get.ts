import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { SessionsStats, VillageStats } from 'types/statistics.type';

async function getSessionsStats(phase?: number): Promise<SessionsStats> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: `/statistics/sessions?phase=${phase}`,
    })
  ).data;
}

async function getOneVillageStats(): Promise<VillageStats> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: `/statistics/one-village`,
    })
  ).data;
}

async function getVillagesStats(villageId?: number, phase?: number): Promise<VillageStats> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: phase ? `/statistics/villages/${villageId}?phase=${phase}` : `/statistics/villages/${villageId}`,
    })
  ).data;
}

async function getCountriesStats(countryCode?: string, phase?: number): Promise<VillageStats> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: phase ? `/statistics/countries/${countryCode}?phase=${phase}` : `/statistics/countries/${countryCode}`,
    })
  ).data;
}

async function getCompareGlobalStats(phase?: number) {
  let params;

  phase && (params = { phase });

  const response = await axiosRequest({
    method: 'GET',
    baseURL: '/api',
    url: `/statistics/compare/one-village`,
    ...(params && { params }),
  });

  if (response.error) {
    return;
  }

  return response.data;
}

export const useGetCompareGlobalStats = (phase?: number) => {
  return useQuery(['compare-countries-stats', phase], () => getCompareGlobalStats(phase));
};

export const useGetSessionsStats = (phase?: number) => {
  return useQuery(['sessions-stats', phase], () => getSessionsStats(phase), {
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: true,
  });
};

export const useGetOneVillageStats = () => {
  return useQuery(['1v-stats'], () => getOneVillageStats());
};

export const useGetVillagesStats = (villageId?: number, phase?: number) => {
  return useQuery(['villages-stats', villageId, phase], () => getVillagesStats(villageId, phase), {
    enabled: villageId !== null,
  });
};

export const useGetCountriesStats = (countryCode?: string, phase?: number) => {
  return useQuery(['countries-stats', countryCode, phase], () => getCountriesStats(countryCode, phase), {
    enabled: !!countryCode,
  });
};

async function getClassroomsStats(classroomId?: number, phase?: number): Promise<VillageStats> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: phase ? `/statistics/classrooms/${classroomId}?phase=${phase}` : `/statistics/classrooms/${classroomId}`,
    })
  ).data;
}

export const useGetClassroomsStats = (classroomId?: number, phase?: number) => {
  return useQuery(['classrooms-stats', classroomId, phase], () => getClassroomsStats(classroomId, phase), {
    enabled: classroomId !== null,
  });
};
