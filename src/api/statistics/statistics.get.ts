import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { ClassroomStats, SessionsStats, VillageStats } from 'types/statistics.type';

async function getSessionsStats(phase: number | null): Promise<SessionsStats> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: `/statistics/sessions/${phase}`,
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

async function getVillagesStats(villageId: number | null, phase: number): Promise<VillageStats> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: phase ? `/statistics/villages/${villageId}?phase=${phase}` : `/statistics/villages/${villageId}`,
    })
  ).data;
}

async function getCountriesStats(countryId: string | null, phase: number): Promise<VillageStats> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: phase ? `/statistics/countries/${countryId}?phase=${phase}` : `/statistics/countries/${countryId}`,
    })
  ).data;
}

export const useGetSessionsStats = (phase: number | null) => {
  return useQuery(['sessions-stats', phase], () => getSessionsStats(phase));
};
export const useGetOneVillageStats = () => {
  return useQuery(['1v-stats'], () => getOneVillageStats());
};

export const useGetVillagesStats = (villageId: number | null, phase: number) => {
  return useQuery(['villages-stats', villageId, phase], () => getVillagesStats(villageId, phase), {
    enabled: villageId !== null,
  });
};
export const useGetCountriesStats = (countryId: string | null, phase: number) => {
  return useQuery(['countries-stats', countryId, phase], () => getCountriesStats(countryId, phase), {
    enabled: countryId !== null,
  });
};

async function getClassroomsStats(classroomId: number | null, phase: number): Promise<ClassroomStats> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: phase ? `/statistics/classrooms/${classroomId}?phase=${phase}` : `/statistics/classrooms/${classroomId}`,
    })
  ).data;
}

export const useGetClassroomsStats = (classroomId: number | null, phase: number) => {
  return useQuery(['classrooms-stats', classroomId, phase], () => getClassroomsStats(classroomId, phase), {
    enabled: classroomId !== null,
  });
};
