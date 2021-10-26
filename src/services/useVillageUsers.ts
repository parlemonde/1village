import type { QueryFunction } from 'react-query';
import { useQuery } from 'react-query';
import React from 'react';

import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';
import type { User } from 'types/user.type';

export const useVillageUsers = (): { users: User[] } => {
  const { user, axiosLoggedRequest } = React.useContext(UserContext);
  const { village, selectedPhase } = React.useContext(VillageContext);

  const villageId = village ? village.id : null;

  const getUsers: QueryFunction<User[]> = React.useCallback(async () => {
    if (!villageId) {
      return [];
    }
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: `/users${serializeToQueryUrl({ villageId })}`,
    });
    if (response.error) {
      return [];
    }
    return response.data;
  }, [villageId, axiosLoggedRequest]);

  const { data, isLoading, error } = useQuery<User[], unknown>(['village-users', { villageId }], getUsers);

  const result =
    data &&
    data.filter((dataUser: User) =>
      selectedPhase !== 1 && village?.activePhase > 1 ? true : dataUser?.countryCode === user?.countryCode ? true : false,
    );

  return {
    users: isLoading || error ? [] : result,
  };
};
