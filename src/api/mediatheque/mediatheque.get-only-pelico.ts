import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { Filter } from 'types/mediatheque.type';

async function getOnlyPelicoMediatheque(params: { filters: Array<Filter[]> }) {
  const { filters } = params;

  return (
    await axiosRequest({
      method: 'POST',
      baseURL: '/api',
      url: '/mediatheque/pelico',
      data: {
        filters: filters,
      },
    })
  ).data;
}

export const useGetOnlyPelicoMediatheque = (filters: Array<Filter[]>) => {
  return useQuery(['OnlyPelicoMediatheque', filters], () => getOnlyPelicoMediatheque({ filters }));
};
