import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Filter } from 'types/mediatheque.type';

async function getMediatheque(params: { filters: Array<Filter[]>; offset?: number; limit?: number }) {
  const { offset, filters, limit } = params;

  return (
    await axiosRequest({
      method: 'POST',
      baseURL: '/api',
      url: '/mediatheque',
      params: {
        offset: offset,
        limit: limit,
      },
      data: {
        filters: filters,
      },
    })
  ).data;
}

export const useGetMediatheque = (filters: Array<Filter[]>, offset?: number, limit?: number) => {
  return useQuery(['Mediatheque', filters, offset, limit], () => getMediatheque({ filters, offset, limit }));
};
