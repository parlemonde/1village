import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Filter } from 'types/mediatheque.type';

async function getMediatheque(params: { filters: Array<Filter[]> }) {
  const { filters } = params;

  return (
    await axiosRequest({
      method: 'POST',
      baseURL: '/api',
      url: '/mediatheque',
      // params: {
      //   offset: offset,
      //   limit: limit,
      // },
      data: {
        filters: filters,
      },
    })
  ).data;
}

export const useGetMediatheque = (filters: Array<Filter[]>) => {
  return useQuery(['Mediatheque', filters], () => getMediatheque({ filters }));
};
