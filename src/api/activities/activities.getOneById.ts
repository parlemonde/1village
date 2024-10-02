import { useQuery } from 'react-query';
import type { Activity } from 'server/entities/activity';

import { axiosRequest } from 'src/utils/axiosRequest';

async function getOneActivityById(params: { id: number }): Promise<Activity[]> {
  const { id } = params;
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: `/activities/${id}`,
    })
  ).data;
}

export const useGetOneActivityById = (args: { id: number }) => {
  const { id } = args;
  return useQuery(['activities', id], () => getOneActivityById({ id }));
};
