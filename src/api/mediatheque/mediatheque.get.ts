import { useQuery } from 'react-query';
import type { Activity } from 'server/entities/activity';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Filter } from 'types/mediatheque.type';

async function getMediatheque(params: { offset: number | null; filters: Filter[] }): Promise<Activity[]> {
  const { offset, filters } = params;
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/mediatheque/get',
      params: {
        offset,
        filters,
      },
    })
  ).data;
}

export const useGetMediatheque = (offset: number | null, filters: Filter[]) => {
  return useQuery(['Mediatheque', offset, filters], () => getMediatheque({ filters, offset }));
};
