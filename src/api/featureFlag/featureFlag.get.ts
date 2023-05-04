import { axiosRequest } from 'src/utils/axiosRequest';

interface FeatureFlag {
  id: number;
  name: string;
  isEnabled: boolean;
}

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
