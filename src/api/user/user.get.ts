import { axiosRequest } from 'src/utils/axiosRequest';

export const getUsers = async () => {
  const response = await axiosRequest({
    method: 'GET',
    url: '/users',
  });
  if (response.error) {
    return [];
  }
  return response.data;
};
