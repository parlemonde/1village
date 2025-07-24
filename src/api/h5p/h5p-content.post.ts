import type { IContentMetadata } from '@lumieducation/h5p-server';

import { axiosRequest } from 'src/utils/axiosRequest';

export type PostH5pContentParams = {
  library: string | undefined;
  params: Record<string, unknown>;
};

export type PostH5pContentResponse = {
  contentId: string;
  metadata: IContentMetadata;
};

export async function postH5pContent(data: PostH5pContentParams): Promise<PostH5pContentResponse> {
  const response = await axiosRequest<PostH5pContentResponse>({
    method: 'POST',
    baseURL: '/h5p',
    url: '/data',
    data,
  });
  if (response.error) {
    throw new Error('Could not POST H5P content');
  }
  return response.data;
}
