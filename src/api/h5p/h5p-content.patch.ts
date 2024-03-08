import type { IContentMetadata } from '@lumieducation/h5p-server';

import { axiosRequest } from 'src/utils/axiosRequest';

export type PatchH5pContentParams = {
  library: string | undefined;
  params: Record<string, unknown>;
};

export type PatchH5pContentResponse = {
  contentId: string;
  metadata: IContentMetadata;
};

export async function patchH5pContent(contentId: string, data: PatchH5pContentParams): Promise<PatchH5pContentResponse> {
  const response = await axiosRequest<PatchH5pContentResponse>({
    method: 'PATCH',
    baseURL: '/h5p',
    url: `/data/${contentId}`,
    data,
  });
  if (response.error) {
    throw new Error('Could not PATCH H5P content');
  }
  return response.data;
}
