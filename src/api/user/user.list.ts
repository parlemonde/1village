import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { User } from 'types/user.type';

type GetUsersResponse = User[];

export const getUsers = async (): Promise<GetUsersResponse> => {
  const response = await axiosRequest<GetUsersResponse>({
    method: 'GET',
    url: `/users`,
  });
  return response.error ? [] : response.data;
};

export function useUsers() {
  return useQuery(['users'], () => getUsers());
}
