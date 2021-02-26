import { useQuery, QueryFunction } from 'react-query';
import React from 'react';

import { ExtendedActivity } from 'src/components/activities/editing.types';
import { getExtendedActivity } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';

export type Args = {
  limit?: number;
  page?: number;
  countries?: string[];
  pelico?: boolean;
  type?: number;
};

export const useActivities = ({ pelico, countries, ...args }: Args): { activities: ExtendedActivity[] } => {
  const { village } = React.useContext(VillageContext);
  const { axiosLoggedRequest } = React.useContext(UserContext);

  const villageId = village ? village.id : null;

  const getActivities: QueryFunction<ExtendedActivity[]> = React.useCallback(async () => {
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
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: `/activities${serializeToQueryUrl(query)}`,
    });
    if (response.error) {
      return [];
    }
    return response.data.map(getExtendedActivity);
  }, [args, countries, pelico, villageId, axiosLoggedRequest]);
  const { data, isLoading, error } = useQuery<ExtendedActivity[], unknown>(['activities', { ...args, countries, pelico, villageId }], getActivities);

  const prevData = React.useRef<ExtendedActivity[]>([]);
  React.useEffect(() => {
    if (data !== undefined) {
      prevData.current = data;
    }
  }, [data]);
  return {
    activities: isLoading || error ? prevData.current : data,
  };
};
