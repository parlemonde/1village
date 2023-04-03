import React from 'react';
import type { QueryFunction } from 'react-query';
import { useQuery } from 'react-query';

import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { Activity } from 'types/activity.type';

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

export const useActivities = ({ pelico, countries = [], userId, type, ...args }: Args): { activities: Activity[] } => {
  const { village } = React.useContext(VillageContext);

  const villageId = village ? village.id : null;

  const getActivities: QueryFunction<Activity[]> = React.useCallback(async () => {
    if (!villageId) {
      return [];
    }
    const query: {
      [key: string]: string | number | boolean | undefined;
    } = {
      ...args,
      type: Array.isArray(type) ? type.join(',') : type,
      villageId,
      countries: countries.join(','),
      pelico: pelico ? 'true' : 'false',
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
  }, [args, type, countries, pelico, userId, villageId]);
  const { data, isLoading, error } = useQuery<Activity[], unknown>(
    ['activities', { ...args, type, userId, countries, pelico, villageId }],
    getActivities,
  );

  const prevData = React.useRef<Activity[]>([]);
  React.useEffect(() => {
    if (data !== undefined) {
      prevData.current = data;
    }
  }, [data]);

  return {
    activities: error ? [] : isLoading ? prevData.current : data || [],
  };
};
