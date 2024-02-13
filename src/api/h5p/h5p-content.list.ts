import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';

export type h5pContentBaseInfo = {
  contentId: string;
  title: string;
  mainLibrary: string;
};
export type GetH5pContentListData = Array<h5pContentBaseInfo>;

export async function getH5pContentList(): Promise<GetH5pContentListData> {
  const response = await axiosRequest<GetH5pContentListData>({
    method: 'GET',
    baseURL: '/h5p',
    url: `/data`,
  });
  if (response.error) {
    return [];
  }
  return response.data;
}

export const useH5pContentList = () => useQuery(['h5p'], () => getH5pContentList());
