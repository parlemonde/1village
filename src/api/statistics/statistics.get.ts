import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { ClassroomsStats, SessionsStats, VillageStats } from 'types/statistics.type';

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
      url: `/statistics/onevillage`,
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

export const useGetSessionsStats = (phase: number | null) => {
  return useQuery(['sessions-stats'], () => getSessionsStats(phase));
};
export const useGetOneVillageStats = () => {
  return useQuery(['1v-stats'], () => getOneVillageStats());
};

export const useGetVillagesStats = (villageId: number | null, phase: number) => {
  return useQuery(['villages-stats', villageId, phase], () => getVillagesStats(villageId, phase), {
    enabled: villageId !== null,
  });
};

async function getClassroomsStats(): Promise<ClassroomsStats[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/statistics/classrooms',
    })
  ).data;
}

export const useGetClassroomsStats = () => {
  return useQuery(['classrooms-stats'], () => getClassroomsStats());
};
