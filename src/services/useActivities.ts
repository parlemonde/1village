import React from 'react';
import type { QueryFunction } from 'react-query';
import { useQuery } from 'react-query';

import { getUserVisibilityFamilyParams } from 'src/api/user/user.get';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { Activity } from 'types/activity.type';
import type { Classroom } from 'types/classroom.type';
import { UserType } from 'types/user.type';

export type Args = {
  limit?: number;
  page?: number;
  countries?: string[];
  pelico?: boolean;
  type?: number | number[];
  userId?: number;
  status?: number;
  phase?: number;
  responseActivityId?: number;
};

export const useActivities = ({ pelico, countries = [], userId, type, ...args }: Args) => {
  const { village } = React.useContext(VillageContext);
  const { user } = React.useContext(UserContext);

  const villageId = village ? village.id : null;

  const getActivities: QueryFunction<Activity[]> = React.useCallback(async () => {
    if (!user) {
      return [];
    }

    const userClassroomData = (await getUserVisibilityFamilyParams(user)) as [Classroom];

    const isFamily = user.type === UserType.FAMILY;

    const query: {
      [key: string]: string | number | boolean | undefined;
    } = {
      ...args,
      type: Array.isArray(type) ? type.join(',') : type,
      villageId: user.villageId !== null ? user.villageId : villageId !== null ? villageId : undefined,
      countries: countries.join(','),
      pelico: pelico ? 'true' : 'false',
      delayedDays: isFamily ? userClassroomData[0]?.delayedDays : undefined,
      hasVisibilitySetToClass: isFamily ? (userClassroomData[0]?.hasVisibilitySetToClass ? true : false) : undefined,
      teacherId: isFamily ? userClassroomData[0]?.user?.id : undefined,
    };
    if (userId !== undefined) {
      query.userId = userId;
    }

    const response = await axiosRequest({
      method: 'GET',
      url: `/activities${serializeToQueryUrl(query)}`,
    });
    if (response.error) {
      return [];
    }

    return response.data;
  }, [user, args, type, villageId, countries, pelico, userId]);

  const { data, isLoading, error, refetch } = useQuery<Activity[], unknown>(
    ['activities', { ...args, type, userId, countries, pelico, villageId }],
    getActivities,
  );

  const prevData = React.useRef<Activity[]>([]);
  React.useEffect(() => {
    if (data !== undefined) {
      prevData.current = data;
    }
  }, [data]);

  const activities = error ? [] : isLoading ? prevData.current : data || [];

  return {
    activities,
    isLoading,
    error,
    refetch,
  };
};
