import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Filter } from 'types/mediatheque.type';

async function getMediathequeAll(params: { filters: Array<Filter[]> }) {
  const { filters } = params;

  return (
    await axiosRequest({
      method: 'POST',
      baseURL: '/api',
      url: '/mediatheque/all',
      data: {
        filters: filters,
      },
    })
  ).data;
}

export const useGetMediathequeAll = (filters: Array<Filter[]>) => {
  return useQuery(['MediathequeAll', filters], () => getMediathequeAll({ filters }));
};
