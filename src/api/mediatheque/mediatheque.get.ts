import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';

async function getMediatheque() {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/mediatheque',
    })
  ).data;
}

export const useGetMediatheque = () => {
  return useQuery(['Mediatheque'], () => getMediatheque());
};
