import { useMutation } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';

async function uploadFiles(params: { files: File[] }): Promise<string[]> {
  const { files } = params;
  const formData = new FormData();
  for (const file of files) {
    formData.append('files', file);
  }
  return (
    await axiosRequest({
      method: 'POST',
      baseURL: '/api',
      url: `/files`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: formData,
    })
  ).data as Promise<string[]>;
}

export const useUploadFiles = () => {
  return useMutation({
    mutationFn: (files: File[]) => {
      return uploadFiles({ files });
    },
  });
};
