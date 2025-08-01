import { useQuery } from 'react-query';

import type { ComparisonStatistic } from './compare.api';
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

async function getCompareStats(): Promise<ComparisonStatistic[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: `/statistics/compare`,
    })
  ).data;
}

// [Onglet Pays] : /statistics/compare/countries/FR?phase=1
async function getCompareCountriesStats(countryCode: string, phase?: number): Promise<ComparisonStatistic[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: phase ? `/statistics/compare/countries/${countryCode}?phase=${phase}` : `/statistics/compare/countries/${countryCode}`,
    })
  ).data;
}

// [Onglet Village] : /statistics/compare/villages/{villageId}?phase={phaseId}
async function getCompareVillagesStats(villageId: number, phase?: number): Promise<ComparisonStatistic[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: phase ? `/statistics/compare/villages/${villageId}?phase=${phase}` : `/statistics/compare/villages/${villageId}`,
    })
  ).data;
}

// [Onglet Classe] : /statistics/compare/classes/{classroomId}?phase={phaseId}
async function getCompareClassesStats(classroomId: number, phase?: number): Promise<ComparisonStatistic[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: phase ? `/statistics/compare/classes/${classroomId}?phase=${phase}` : `/statistics/compare/classes/${classroomId}`,
    })
  ).data;
}

export const useGetCompareStats = () => {
  return useQuery(['compare-stats'], () => getCompareStats());
};

export const useGetCompareCountriesStats = (countryCode: string, phase?: number) => {
  return useQuery(['compare-countries-stats', countryCode, phase], () => getCompareCountriesStats(countryCode, phase), {
    enabled: !!countryCode,
  });
};

export const useGetCompareVillagesStats = (villageId: number, phase?: number) => {
  return useQuery(['compare-villages-stats', villageId, phase], () => getCompareVillagesStats(villageId, phase), {
    enabled: villageId !== null,
  });
};

export const useGetCompareClassesStats = (classroomId: number, phase?: number) => {
  return useQuery(['compare-classes-stats', classroomId, phase], () => getCompareClassesStats(classroomId, phase), {
    enabled: classroomId !== null,
  });
};
