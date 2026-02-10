import { useMutation } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';

async function uploadFiles(params: { files: File[] }): Promise<string[]> {
  const { files } = params;
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }
  const result = await axiosRequest({
    method: 'POST',
    baseURL: '/api',
    url: `/files`,
    data: formData,
  });
  if (!Array.isArray(result.data)) {
    throw new Error('Invalid API response for file import !');
  }
  return result.data;
}

export const useUploadFiles = () => {
  return useMutation({
    mutationFn: (files: File[]) => {
      return uploadFiles({ files });
    },
    onError: (error) => {
      console.error('File upload failed', error);
    },
  });
};
