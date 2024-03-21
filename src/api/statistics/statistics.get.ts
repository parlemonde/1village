import { useQuery } from 'react-query';
import type { Activity } from 'server/entities/activity';

import { axiosRequest } from 'src/utils/axiosRequest';

async function getContributions(): Promise<Activity[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/statistics/contributions',
    })
  ).data;
}

export const useGetContributions = () => {
  return useQuery(['activities'], () => getContributions());
};
