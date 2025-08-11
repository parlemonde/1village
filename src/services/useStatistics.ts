import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { ClassroomsStats, SessionsStats } from 'types/statistics.type';

interface RequestParams {
  [key: string]: string;
}

function buildUrl(baseUrl: string, params: { [key: string]: string }): string {
  if (Object.keys(params).length > 0) {
    const requestParams: string = Object.entries(params)
      .flatMap(([key, value]) => `${key}=${value}`)
      .join('&');

    return `${baseUrl}?${requestParams}`;
  }

  return baseUrl;
}

async function getClassroomStatistics(
  villageId?: number | null,
  countryCode?: string | null,
  classroomId?: number | null,
  phase?: number | null,
): Promise<ClassroomsStats> {
  const baseUrl: string = '/statistics/sessions';
  const params: RequestParams = {};

  if (villageId != null) params.villageId = villageId.toString();
  if (countryCode != null) params.countryCode = countryCode;
  if (classroomId != null) params.classroomId = classroomId.toString();
  if (phase != null) params.phase = phase.toString();

  const finalUrl = buildUrl(baseUrl, params);

  return (
    await axiosRequest({
      method: 'GET',
      url: finalUrl,
    })
  ).data;
}

async function getSessionsStatistics(
  villageId?: number | null,
  countryCode?: string | null,
  classroomId?: number | null,
  phase?: number | null,
): Promise<SessionsStats> {
  const baseUrl: string = '/statistics/sessions';
  const params: RequestParams = {};

  if (villageId != null) params.villageId = villageId.toString();
  if (countryCode != null) params.countryCode = countryCode;
  if (classroomId != null) params.classroomId = classroomId.toString();
  if (phase != null) params.phase = phase.toString();

  const finalUrl = buildUrl(baseUrl, params);

  return (
    await axiosRequest({
      method: 'GET',
      url: finalUrl,
    })
  ).data;
}

export function useStatisticsClassrooms(villageId?: number | null, countryCode?: string | null, classroomId?: number | null, phase?: number | null) {
  const queryResult = useQuery<ClassroomsStats>(
    ['classrooms', villageId, countryCode, classroomId],
    () => getClassroomStatistics(villageId, countryCode, classroomId, phase),
    {
      enabled: villageId != null || countryCode != null,
    },
  );

  const emptyStats: ClassroomsStats = {
    classroomId: 0,
    classroomCountryCode: '',
    villageId: 0,
    villageName: '',
    userFirstName: 0,
    userLastName: 0,
    commentsCount: 0,
    videosCount: 0,
    activities: [],
  };

  return {
    ...queryResult,
    data: queryResult.isLoading || queryResult.error || !queryResult.data ? emptyStats : queryResult.data,
  };
}

export const useStatisticsSessions = (villageId?: number | null, countryCode?: string | null, classroomId?: number | null, phase?: number | null) => {
  const queryResult = useQuery<SessionsStats>(
    ['session', villageId, countryCode, classroomId, phase],
    () => getSessionsStatistics(villageId, countryCode, classroomId, phase),
    {
      staleTime: 0,
      cacheTime: 0,
      refetchOnMount: true,
    },
  );
  return {
    ...queryResult,
    data: queryResult.isLoading || queryResult.error || !queryResult.data ? ({} as SessionsStats) : queryResult.data,
  };
};
