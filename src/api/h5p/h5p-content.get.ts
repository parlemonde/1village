import type { IContentMetadata, IEditorModel } from '@lumieducation/h5p-server';
import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';

export type GetH5pContentData = IEditorModel & {
  library?: string | undefined;
  metadata?: IContentMetadata | undefined;
  params?: Record<string, unknown>;
};

export async function getH5pContent(contentId: string = 'new'): Promise<GetH5pContentData> {
  const response = await axiosRequest<GetH5pContentData>({
    method: 'GET',
    baseURL: '/h5p',
    url: `/data/${contentId}/edit`,
  });
  if (response.error) {
    throw new Error('Could not GET H5P content');
  }
  return response.data;
}

export const useGetH5pContent = (args: { contentId: string }) => {
  const { contentId } = args;
  return useQuery(['h5p', contentId], () => getH5pContent(contentId));
};
