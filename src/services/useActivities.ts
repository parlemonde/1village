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

    const userClassroomData = (await getUserVisibilityFamilyParams(user)) as Classroom;

    console.log('userClassroomData ===', userClassroomData);
    console.log('userClassroomDataUserId===', userClassroomData.user?.id);
    console.log('userClassroomDataDelayedDats ===', userClassroomData.delayedDays);

    const isFamilyOrTeacher = user.type === UserType.FAMILY || user.type === UserType.TEACHER;

    console.log('family conditions', isFamilyOrTeacher);

    const query: {
      [key: string]: string | number | boolean | undefined;
    } = {
      ...args,
      type: Array.isArray(type) ? type.join(',') : type,
      villageId: villageId !== null ? (user.villageId !== null ? user.villageId : undefined) : undefined,
      countries: countries.join(','),
      pelico: pelico ? 'true' : 'false',
      delayedDays: isFamilyOrTeacher ? userClassroomData?.delayedDays : undefined,
      hasVisibilitySetToClass: isFamilyOrTeacher ? (userClassroomData?.hasVisibilitySetToClass ? true : false) : undefined,
      teacherId: isFamilyOrTeacher ? userClassroomData?.user?.id : undefined,
    };
    if (userId !== undefined) {
      query.userId = userId;
    }
    // console.log('user', user);
    // console.log('query', query);
    // console.log('visibilityFamily', visibilityFamily);
    // console.log('data1', classroomData);
    // console.log('students', students);

    console.log('query', query);

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
