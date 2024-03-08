import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';

export async function checkH5pContentList(): Promise<boolean> {
  const response = await axiosRequest<unknown>({
    method: 'GET',
    baseURL: '/h5p',
    url: `/_healthcheck`,
  });
  if (response.error) {
    return false;
  }
  return true;
}

export const useIsH5pEnabled = () => useQuery(['h5p-enabled'], () => checkH5pContentList()).data || false;
