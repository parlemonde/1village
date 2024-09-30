import { useQuery } from 'react-query';
import type { Village } from 'server/entities/village';

import { axiosRequest } from 'src/utils/axiosRequest';

async function getVillages(countryIsoCode?: string): Promise<Village[]> {
  const url = countryIsoCode ? `/villages?countryIsoCode=${countryIsoCode}` : '/villages';
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: url,
    })
  ).data;
}

export const useGetVillages = (countryIsoCode?: string) => {
  return useQuery(['villages', countryIsoCode], () => getVillages(countryIsoCode), {
    enabled: !!countryIsoCode || countryIsoCode === undefined,
  });
};
