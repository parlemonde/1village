import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';

async function getChildrenActivitiesById(params: { id: number }) {
  const { id } = params;
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: `/activities/children`,
      params: {
        id,
      },
    })
  ).data;
}

export const useGetChildrenActivitiesById = (args: { id: number }) => {
  const { id } = args;
  return useQuery(['childrenActivities', id], () => getChildrenActivitiesById({ id }));
};
