import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { SessionsStats, VillageStats, ClassroomToMonitor, EngagementLevelParams, EngagementLevel } from 'types/statistics.type';

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

async function getCountriesStats(countryId?: string, phase?: number): Promise<VillageStats> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: phase ? `/statistics/countries/${countryId}?phase=${phase}` : `/statistics/countries/${countryId}`,
    })
  ).data;
}

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
export const useGetCountriesStats = (countryId?: string, phase?: number) => {
  return useQuery(['countries-stats', countryId, phase], () => getCountriesStats(countryId, phase), {
    enabled: countryId !== null,
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

function getClassroomsUrl(countryId?: string, villageId?: number): string {
  let baseClassroomsURL = `/statistics/classrooms-to-monitor`;
  if (countryId || villageId) {
    baseClassroomsURL += '?';
    if (countryId) {
      baseClassroomsURL = `${baseClassroomsURL}&country=${countryId}`;
    }
    if (villageId) {
      baseClassroomsURL = `${baseClassroomsURL}&village=${villageId}`;
    }
  }

  return baseClassroomsURL;
}

async function getClassroomsToMonitor(countryId?: string, villageId?: number): Promise<ClassroomToMonitor[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: getClassroomsUrl(countryId, villageId),
    })
  ).data;
}

export const useGetClassroomsToMonitorStats = (countryId?: string, villageId?: number) => {
  return useQuery(['classrooms-to_monitor-stats', countryId, villageId], () => getClassroomsToMonitor(countryId, villageId));
};

function getClassroomsEngagementLevelUrl(engagementLevelParams: EngagementLevelParams): string {
  let baseClassroomsURL = `/statistics/classrooms-engagement-level`;
  if (engagementLevelParams.countryCode) {
    baseClassroomsURL = `${baseClassroomsURL}?&countryCode=${engagementLevelParams.countryCode}`;
  }
  if (engagementLevelParams.villageId) {
    baseClassroomsURL = `${baseClassroomsURL}?&villageId=${engagementLevelParams.villageId}`;
  }

  return baseClassroomsURL;
}

async function getClassroomsEngagementLevel(engagementLevelParams: EngagementLevelParams): Promise<EngagementLevel[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: getClassroomsEngagementLevelUrl(engagementLevelParams),
    })
  ).data;
}

export function useGetClassroomsEngagementLevel(engagementLevelParams: EngagementLevelParams) {
  return useQuery(
    ['classrooms-engagement-level-stats', engagementLevelParams.countryCode, engagementLevelParams.villageId],
    () => getClassroomsEngagementLevel(engagementLevelParams),
    {
      enabled: !!engagementLevelParams.countryCode || !!engagementLevelParams.villageId,
    },
  );
}
