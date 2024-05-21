import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Filter } from 'types/mediatheque.type';

async function getMediathequeCount(params: { filters: Array<Filter[]> }) {
  const { filters } = params;

  return (
    await axiosRequest({
      method: 'POST',
      baseURL: '/api',
      url: '/mediatheque/count',
      data: {
        filters: filters,
      },
    })
  ).data.count.length;
}

export const useGetMediathequeCount = (filters: Array<Filter[]>) => {
  return useQuery(['MediathequeCount', filters], () => getMediathequeCount({ filters }));
};
