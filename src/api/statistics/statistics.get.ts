import { useQuery } from 'react-query';

import type { ComparisonStatistic } from './compare.api';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { Classroom } from 'types/classroom.type';
import type {
  SessionsStats,
  VillageStats,
  EngagementStatus,
  CountryEngagementStatus,
  ClassroomDetails,
  ClassroomToMonitor,
  EngagementStatusParams,
  EngagementStatusData,
} from 'types/statistics.type';

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
  const response = await axiosRequest({
    method: 'GET',
    baseURL: '/api',
    url: `/statistics/compare/one-village`,
    params: phase ? { phase } : undefined,
  });

  if (response.error) {
    return;
  }

  return response.data;
}

export function useGetCompareGlobalStats(phase?: number) {
  return useQuery(['compare-countries-stats', phase], () => getCompareGlobalStats(phase));
}

export function useGetSessionsStats(phase?: number) {
  return useQuery(['sessions-stats', phase], () => getSessionsStats(phase), {
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: true,
  });
}

export function useGetOneVillageStats() {
  return useQuery(['1v-stats'], () => getOneVillageStats());
}

async function getCountriesEngagementStatuses(): Promise<CountryEngagementStatus[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/statistics/one-village/countries-engagement-statuses',
    })
  ).data;
}

export function useGetCountriesEngagementStatuses() {
  return useQuery(['countries-engagement-statuses-stats'], () => getCountriesEngagementStatuses());
}

export function useGetVillagesStats(villageId?: number, phase?: number) {
  return useQuery(['villages-stats', villageId, phase], () => getVillagesStats(villageId, phase), {
    enabled: villageId !== null,
  });
}

async function getVillageEngagementStatus(villageId?: number): Promise<EngagementStatus> {
  const url = `/statistics/villages/${villageId}/engagement-status`;
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url,
    })
  ).data.status;
}

export function useGetVillageEngagementStatus(villageId?: number) {
  return useQuery(['village-engagement-status', villageId], () => getVillageEngagementStatus(villageId), {
    enabled: !!villageId,
  });
}

export function useGetCountriesStats(countryCode?: string, phase?: number) {
  return useQuery<VillageStats>(['countries-stats', countryCode, phase], () => getCountriesStats(countryCode, phase), {
    enabled: !!countryCode,
  });
}

async function getCountryEngagementStatus(countryCode?: string): Promise<EngagementStatus> {
  const url = `/statistics/countries/${countryCode}/engagement-status`;
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url,
    })
  ).data.status;
}

export function useGetCountryEngagementStatus(countryCode?: string) {
  return useQuery(['country-engagement-status', countryCode], () => getCountryEngagementStatus(countryCode), {
    enabled: !!countryCode,
  });
}

async function getClassroomsStats(classroomId?: number, phase?: number): Promise<VillageStats> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: phase ? `/statistics/classrooms/${classroomId}?phase=${phase}` : `/statistics/classrooms/${classroomId}`,
    })
  ).data;
}

export function useGetClassroomDetails(classroomId?: number) {
  return useQuery(['classrooms-stats', classroomId], () => getClassroomDetails(classroomId), {
    enabled: !!classroomId,
  });
}

async function getClassroomDetails(classroomId?: number): Promise<ClassroomDetails> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: `/statistics/classrooms/details/${classroomId}`,
    })
  ).data;
}

export function useGetClassroomsStats(classroomId?: number, phase?: number) {
  return useQuery(['classrooms-stats', classroomId, phase], () => getClassroomsStats(classroomId, phase), {
    enabled: classroomId !== null,
  });
}

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

async function getCompareStats(): Promise<ComparisonStatistic[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: `/statistics/compare`,
    })
  ).data;
}

function getClassroomsEngagementStatusUrl(engagementStatusParams: EngagementStatusParams): string {
  let baseClassroomsURL = `/statistics/classrooms-engagement-status`;
  if (engagementStatusParams.countryCode) {
    baseClassroomsURL = `${baseClassroomsURL}?&countryCode=${engagementStatusParams.countryCode}`;
  }
  if (engagementStatusParams.villageId) {
    baseClassroomsURL = `${baseClassroomsURL}?&villageId=${engagementStatusParams.villageId}`;
  }

  return baseClassroomsURL;
}

async function getClassroomsEngagementStatus(engagementStatusParams: EngagementStatusParams): Promise<EngagementStatusData[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: getClassroomsEngagementStatusUrl(engagementStatusParams),
    })
  ).data;
}

async function getCompareCountriesStats(countryCode: string, phase?: number): Promise<ComparisonStatistic[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: phase ? `/statistics/compare/countries/${countryCode}?phase=${phase}` : `/statistics/compare/countries/${countryCode}`,
    })
  ).data;
}

export function useGetClassroomsEngagementStatus(engagementStatusParams: EngagementStatusParams) {
  return useQuery(
    ['classrooms-engagement-status-stats', engagementStatusParams.countryCode, engagementStatusParams.villageId],
    () => getClassroomsEngagementStatus(engagementStatusParams),
    {
      enabled: !!engagementStatusParams.countryCode || !!engagementStatusParams.villageId,
    },
  );
}

async function getClassroomEngagementStatus(classroomId?: Classroom['id']): Promise<EngagementStatus> {
  const url = `/statistics/classrooms/${classroomId}/engagement-status`;
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url,
    })
  ).data.status;
}

export function useGetClassroomEngagementStatus(classroomId?: Classroom['id']) {
  return useQuery(['classroom-engagement-status', classroomId], () => getClassroomEngagementStatus(classroomId), {
    enabled: !!classroomId,
  });
}

async function getCompareVillagesStats(villageId: number, phase?: number): Promise<ComparisonStatistic[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',

      url: phase ? `/statistics/compare/villages/${villageId}?phase=${phase}` : `/statistics/compare/villages/${villageId}`,
    })
  ).data;
}

async function getCompareClassesStats(classroomId: number, phase?: number): Promise<ComparisonStatistic[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: phase ? `/statistics/compare/classes/${classroomId}?phase=${phase}` : `/statistics/compare/classes/${classroomId}`,
    })
  ).data;
}

export function useGetCompareStats() {
  return useQuery(['compare-stats'], () => getCompareStats());
}

export function useGetCompareCountriesStats(countryCode: string, phase?: number) {
  return useQuery(['compare-countries-stats', countryCode, phase], () => getCompareCountriesStats(countryCode, phase), {
    enabled: !!countryCode,
  });
}

export function useGetCompareVillagesStats(villageId: number, phase?: number) {
  return useQuery(['compare-villages-stats', villageId, phase], () => getCompareVillagesStats(villageId, phase), {
    enabled: villageId !== null,
  });
}

export function useGetCompareClassesStats(classroomId: number, phase?: number) {
  return useQuery<ComparisonStatistic[]>(['compare-classes-stats', classroomId, phase], () => getCompareClassesStats(classroomId, phase), {
    enabled: classroomId !== null,
  });
}
