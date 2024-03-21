import { axiosRequest } from 'src/utils/axiosRequest';

export const getGlobalContribution = async () => {
  const response = await axiosRequest({
    method: 'GET',
    url: '/statistics/contributions',
  });
  if (response.error) {
    return [];
  }
  return response.data;
};
