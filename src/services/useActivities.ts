import React from 'react';
import type { QueryFunction } from 'react-query';
import { useQuery } from 'react-query';

import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { Activity } from 'types/activity.type';
import type { Student } from 'types/student.type';
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
  selectedStudent?: Student;
};

export const useActivities = ({ pelico, countries = [], userId, selectedStudent, type, ...args }: Args) => {
  const { village } = React.useContext(VillageContext);
  const { user } = React.useContext(UserContext);

  const getVisibilityFamilyParams = React.useCallback(async () => {
    if (user && user.type !== UserType.FAMILY) return [];
    const response = await axiosRequest({
      method: 'GET',
      url: '/users/visibility-params',
    });
    if (response.error) return null;
    return response.data;
  }, [user]);

  const villageId = village ? village.id : null;
  const getActivities: QueryFunction<Activity[]> = React.useCallback(async () => {
    if (!user) {
      return [];
    }

    // ! Warning: this is only working if the parent as one child in db
    // ! This code will need to evolve to include use case of multiple children
    // ! For exemple add parameter studentId to getVisibilityParams when student is selected
    const visibilityFamily = (await getVisibilityFamilyParams()) as [UserParamClassroom];
    const data = visibilityFamily.find((classroom) => classroom.student_id === selectedStudent?.id);
    const familyConditions = user.type === UserType.FAMILY && visibilityFamily.length > 0;
    const selectedStudentId = userId !== undefined ? userId : selectedStudent ? selectedStudent.id : undefined;
    const query: {
      [key: string]: string | number | boolean | undefined;
    } = {
      ...args,
      type: Array.isArray(type) ? type.join(',') : type,
      villageId: villageId !== null ? villageId : data?.classroom_villageId,
      countries: countries.join(','),
      pelico: pelico ? 'true' : 'false',
      delayedDays: familyConditions ? data?.classroom_delayedDays : undefined,
      hasVisibilitySetToClass: familyConditions ? (data?.classroom_hasVisibilitySetToClass === 1 ? true : false) : undefined,
      teacherId: familyConditions ? data?.classroom_userId : undefined,
    };
    if (userId !== undefined) {
      query.userId = userId;
    }
    console.log('query', query);
    const response = await axiosRequest({
      method: 'GET',
      url: `/activities${serializeToQueryUrl(query)}`,
    });
    if (response.error) {
      return [];
    }

    return response.data;
  }, [user, getVisibilityFamilyParams, args, type, villageId, countries, pelico, userId, selectedStudent]);

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
