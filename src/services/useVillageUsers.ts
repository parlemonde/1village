import React from 'react';
import type { QueryFunction } from 'react-query';
import { useQuery } from 'react-query';

import { UserContext } from 'src/contexts/userContext';
import { VillageContext } from 'src/contexts/villageContext';
import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { User } from 'types/user.type';
import { UserType } from 'types/user.type';

export const useVillageUsers = (): { users: User[] } => {
  const { village, selectedPhase } = React.useContext(VillageContext);
  const { user } = React.useContext(UserContext);

  const villageId = village ? village.id : null;
  const isPelico = user !== null && user.type < UserType.TEACHER;
  const userCountryIsoCode = user ? user.country?.isoCode : null;

  const getUsers: QueryFunction<User[]> = React.useCallback(async () => {
    if (villageId === null || userCountryIsoCode === null) {
      return [];
    }
    const response = await axiosRequest({
      method: 'GET',
      url: `/users${serializeToQueryUrl({ villageId })}`,
    });
    if (response.error) {
      return [];
    }
    if (selectedPhase === 1 && !isPelico) {
      return (response.data as User[]).filter(
        (currentUser) => currentUser.country?.isoCode === userCountryIsoCode || currentUser.type < UserType.TEACHER,
      );
    }
    return response.data as User[];
  }, [villageId, selectedPhase, userCountryIsoCode, isPelico]);

  const { data, isLoading, error } = useQuery<User[], unknown>(
    ['village-users', { villageId, selectedPhase, userCountryIsoCode, isPelico }],
    getUsers,
  );

  return {
    users: isLoading || error ? [] : data || [],
  };
};
