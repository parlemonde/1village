import type { IPlayerModel } from '@lumieducation/h5p-server';

import { serializeToQueryUrl } from 'src/utils';
import { axiosRequest } from 'src/utils/axiosRequest';

export type GetH5pContentPlayData = IPlayerModel;

export async function getH5pContentPlay(contentId: string, contextId?: string): Promise<GetH5pContentPlayData> {
  const response = await axiosRequest<GetH5pContentPlayData>({
    method: 'GET',
    baseURL: '/h5p',
    url: `/data/${contentId}/play${serializeToQueryUrl({ contextId })}`,
  });
  if (response.error) {
    throw new Error('Could not GET H5P content');
  }
  return response.data;
}
