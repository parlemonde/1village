import type { QueryFunction } from 'react-query';
import { useQuery } from 'react-query';
import React from 'react';

import type { AnyActivity } from 'src/activity-types/anyActivity.types';
import { getAnyActivity } from 'src/activity-types/anyActivity';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';

export type Args = {
  limit?: number;
  page?: number;
  countries?: string[];
  pelico?: boolean;
  type?: any;
  userId?: number;
  status?: number;
  responseActivityId?: number;
};

export const useActivities = ({ pelico, countries = [], userId, ...args }: Args): { activities: AnyActivity[] } => {
  const { village } = React.useContext(VillageContext);
  const { axiosLoggedRequest } = React.useContext(UserContext);

  const villageId = village ? village.id : null;

  const getActivities: QueryFunction<AnyActivity[]> = React.useCallback(async () => {
    if (!villageId) {
      return [];
    }
    const query: {
      [key: string]: string | number | boolean;
    } = {
      ...args,
      villageId,
      countries: countries.join(','),
      pelico: pelico ? 'true' : 'false',
    };
    if (userId !== undefined) {
      query.userId = userId;
    }
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: `/activities${serializeToQueryUrl(query)}`,
    });
    if (response.error) {
      return [];
    }
    return response.data.map(getAnyActivity);
  }, [args, countries, pelico, userId, villageId, axiosLoggedRequest]);
  const { data, isLoading, error } = useQuery<AnyActivity[], unknown>(
    ['activities', { ...args, userId, countries, pelico, villageId }],
    getActivities,
  );

  const prevData = React.useRef<AnyActivity[]>([]);
  React.useEffect(() => {
    if (data !== undefined) {
      prevData.current = data;
    }
  }, [data]);
  return {
    activities: isLoading || error ? prevData.current : data,
  };
};
