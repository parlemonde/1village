import { useQuery } from 'react-query';
import type { Village } from 'server/entities/village';

import { axiosRequest } from 'src/utils/axiosRequest';

async function getVillages(): Promise<Village[]> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/villages',
    })
  ).data;
}

export const useGetVillages = () => {
  return useQuery(['villages'], getVillages);
};
