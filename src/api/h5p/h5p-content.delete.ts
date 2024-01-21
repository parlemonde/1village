import { useMutation } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';

export async function deleteH5pContent(contentId: string): Promise<void> {
  const response = await axiosRequest<never>({
    method: 'DELETE',
    baseURL: '/h5p',
    url: `/data/${contentId}`,
  });
  if (response.error) {
    throw new Error('Could not Delete H5P content');
  }
  return response.data;
}

export function useDeleteH5pContentMutation() {
  return useMutation((contentId: string) => deleteH5pContent(contentId));
}
