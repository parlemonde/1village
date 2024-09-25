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

async function getVillagesStats(villageId: number | null): Promise<VillageStats> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: `/statistics/villages/${villageId}`,
    })
  ).data;
}

export const useGetSessionsStats = (phase: number | null) => {
  return useQuery(['sessions-stats'], () => getSessionsStats(phase));
};

export const useGetVillagesStats = (villageId: number | null) => {
  return useQuery(['villages-stats'], () => getVillagesStats(villageId));
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
