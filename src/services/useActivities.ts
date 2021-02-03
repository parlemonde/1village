import { useQuery, QueryFunction } from "react-query";
import React from "react";

import { ExtendedActivity, getExtendedActivity } from "src/contexts/activityContext";
import { UserContext } from "src/contexts/userContext";
import { VillageContext } from "src/contexts/villageContext";
import { serializeToQueryUrl } from "src/utils";

export const useActivities = (): { activities: ExtendedActivity[] } => {
  const { village } = React.useContext(VillageContext);
  const { axiosLoggedRequest } = React.useContext(UserContext);

  const villageId = village ? village.id : null;

  const getActivities: QueryFunction<ExtendedActivity[]> = React.useCallback(async () => {
    if (!villageId) {
      return [];
    }
    const response = await axiosLoggedRequest({
      method: "GET",
      url: `/activities${serializeToQueryUrl({ villageId })}`,
    });
    if (response.error) {
      return [];
    }
    return response.data.map(getExtendedActivity);
  }, [villageId, axiosLoggedRequest]);
  const { data, isLoading, error } = useQuery<ExtendedActivity[], unknown>(["activities", { villageId }], getActivities);

  return {
    activities: isLoading || error ? [] : data,
  };
};
