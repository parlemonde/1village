import * as React from 'react';
import { useQuery } from 'react-query';

import { UserContext } from 'src/contexts/userContext';
import { axiosRequest } from 'src/utils/axiosRequest';
import type { FeatureFlagsNames } from 'types/featureFlag.constant';
import type { FeatureFlag } from 'types/featureFlag.type';
import type { User } from 'types/user.type';

export const fetchFeatureFlags = async () => {
  const response = await axiosRequest<Array<FeatureFlag & { users: User[] }>>({
    method: 'GET',
    url: `/featureFlags`,
  });

  if (response.error) {
    return [];
  }
  return response.data;
};

export const fetchFeatureFlag = async (featureFlagName: FeatureFlagsNames) => {
  const response = await axiosRequest<FeatureFlag>({
    method: 'GET',
    url: `/featureFlags/${featureFlagName}`,
  });

  if (response.error) {
    return null;
  }

  return response.data;
};

export const getUserFeatureFlags = async (): Promise<string[]> => {
  const response = await axiosRequest<string[]>({
    method: 'GET',
    url: `/users/featureFlags`,
  });
  if (response.error) {
    return [];
  }
  return response.data;
};

export const useFeatureFlags = () => {
  return useQuery(['feature-flags'], () => fetchFeatureFlags());
};

export const useUsersFeatureFlags = () => {
  const { user } = React.useContext(UserContext);
  return useQuery(['feature-flags', user?.id] as [string, number | undefined], () => getUserFeatureFlags(), {
    enabled: user !== null,
  });
};

export const useIsFeatureFlagEnabled = (featureName: FeatureFlagsNames) => {
  const { user } = React.useContext(UserContext);
  const { data, isLoading } = useUsersFeatureFlags();
  const hasFeature = (data || []).find((flag) => flag === featureName) !== undefined;

  return {
    isEnabled: hasFeature,
    isLoading: isLoading || user === null,
  };
};
