import { axiosRequest } from 'src/utils/axiosRequest';
import type { FeatureFlag } from 'types/featureFlag.type';

export const fetchFeatureFlags = async () => {
  const response = await axiosRequest({
    method: 'GET',
    url: `/featureFlags`,
  });

  if (response.error) {
    return [];
  }
  return response.data;
};

export const getUserFeatureFlags = async (userId: number): Promise<FeatureFlag[]> => {
  const response = await axiosRequest({
    method: 'GET',
    url: `/users/${userId}/featureFlags`,
  });
  if (response.error) {
    return [];
  }
  return response.data;
};

export const fetchUsersByFeatureFlag = async (featureFlagName: string) => {
  const response = await axiosRequest({
    method: 'GET',
    url: `/featureFlags/${featureFlagName}/users`,
  });

  if (response.error) {
    return [];
  }

  return response.data;
};

export const fetchFeatureFlagByName = async (featureFlagName: string) => {
  const response = await axiosRequest({
    method: 'GET',
    url: `/featureFlags/${featureFlagName}`,
  });

  if (response.error) {
    return null;
  }

  return response.data;
};

export const fetchFeatureFlagAndUsers = async (featureFlagName: string) => {
  const response = await axiosRequest({
    method: 'GET',
    url: `/featureFlags/${featureFlagName}`,
  });

  if (response.error) {
    return { fetchedFeatureFlag: null, fetchedUsers: [] };
  }

  return { fetchedFeatureFlag: response.data.featureFlag, fetchedUsers: response.data.users };
};
