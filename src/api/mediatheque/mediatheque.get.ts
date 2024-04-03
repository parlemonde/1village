import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Filter } from 'types/mediatheque.type';

async function getMediatheque(params: { offset: number | null; filters: Filter[] }) {
  const { offset, filters } = params;

  return (
    await axiosRequest({
      method: 'POST',
      baseURL: '/api',
      url: '/mediatheque',
      params: {
        offset: offset,
      },
      data: {
        filters: filters,
      },
    })
  ).data;
}

export const useGetMediatheque = (offset: number | null, filters: Filter[]) => {
  return useQuery(['Mediatheque', offset, filters], () => getMediatheque({ filters, offset }));
};
