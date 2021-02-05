import { useQuery, QueryFunction } from "react-query";
import React from "react";

import { UserContext } from "src/contexts/userContext";
import { VillageContext } from "src/contexts/villageContext";
import { serializeToQueryUrl } from "src/utils";
import type { User } from "types/user.type";

export const useVillageUsers = (): { users: User[] } => {
  const { axiosLoggedRequest } = React.useContext(UserContext);
  const { village } = React.useContext(VillageContext);

  const villageId = village ? village.id : null;

  const getUsers: QueryFunction<User[]> = React.useCallback(async () => {
    if (!villageId) {
      return [];
    }
    const response = await axiosLoggedRequest({
      method: "GET",
      url: `/users${serializeToQueryUrl({ villageId })}`,
    });
    if (response.error) {
      return [];
    }
    return response.data;
  }, [villageId, axiosLoggedRequest]);

  const { data, isLoading, error } = useQuery<User[], unknown>(["village-users", { villageId }], getUsers);

  return {
    users: isLoading || error ? [] : data,
  };
};
