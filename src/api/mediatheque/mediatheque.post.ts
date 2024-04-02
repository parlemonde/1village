import { useQuery } from 'react-query';
import type { Activity } from 'server/entities/activity';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Filter } from 'types/mediatheque.type';

async function postMediatheque(params: { limit: number | null; offset: number | null; filters: Filter[] | null }): Promise<Activity[]> {
  const { limit, offset, filters } = params;
  return (
    await axiosRequest({
      method: 'POST',
      baseURL: '/api',
      url: '/mediatheque/post',
      params: {
        limit,
        offset,
        filters,
      },
    })
  ).data;
}

export const usePostMediatheque = (limit: number | null, offset: number | null, filters: Filter[] | null) => {
  return useQuery(['Mediatheque', limit, offset, filters], () => postMediatheque({ limit, filters, offset }));
};
