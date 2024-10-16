import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';

async function getOneActivityById(params: { id: number }) {
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
  return useQuery(['activityById', id], () => getOneActivityById({ id }));
};
