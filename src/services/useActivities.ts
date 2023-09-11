import React from 'react';
import type { QueryFunction } from 'react-query';
import { useQuery } from 'react-query';

import { getUserVisibilityFamilyParams } from 'src/api/user/user.get';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { Activity } from 'types/activity.type';
import type { UserParamClassroom } from 'types/user.type';
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
  selectedStudent?: number;
};

export const useActivities = ({ pelico, countries = [], userId, type, ...args }: Args) => {
  const { village } = React.useContext(VillageContext);
  const { user, selectedStudent } = React.useContext(UserContext);

  const villageId = village ? village.id : null;

  const getActivities: QueryFunction<Activity[]> = React.useCallback(async () => {
    if (!user) {
      return [];
    }

    const visibilityFamily = (await getUserVisibilityFamilyParams(user)) as [UserParamClassroom];

    console.log('visibilityFamily ===', visibilityFamily);

    const classroomData = visibilityFamily[selectedStudent || 1];

    console.log('classroomData === ', classroomData);

    // console.log('data', classroomData);
    const familyConditions = user.type === UserType.FAMILY && visibilityFamily.length > 0;

    console.log('family conditions', familyConditions);

    const query: {
      [key: string]: string | number | boolean | undefined;
    } = {
      ...args,
      type: Array.isArray(type) ? type.join(',') : type,
      villageId: villageId !== null ? villageId : classroomData?.classroom_villageId,
      countries: countries.join(','),
      pelico: pelico ? 'true' : 'false',
      delayedDays: familyConditions ? classroomData?.classroom_delayedDays : undefined,
      hasVisibilitySetToClass: familyConditions ? (classroomData?.classroom_hasVisibilitySetToClass === 1 ? true : false) : undefined,
      teacherId: familyConditions ? classroomData?.classroom_userId : undefined,
    };
    if (userId !== undefined) {
      query.userId = userId;
    }
    // console.log('user', user);
    // console.log('query', query);
    // console.log('visibilityFamily', visibilityFamily);
    // console.log('data1', classroomData);
    // console.log('students', students);

    const response = await axiosRequest({
      method: 'GET',
      url: `/activities${serializeToQueryUrl(query)}`,
    });
    if (response.error) {
      return [];
    }

    return response.data;
  }, [user, args, type, villageId, countries, pelico, userId, selectedStudent]);

  const { data, isLoading, error, refetch } = useQuery<Activity[], unknown>(
    ['activities', { ...args, type, userId, selectedStudent, countries, pelico, villageId }],
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
