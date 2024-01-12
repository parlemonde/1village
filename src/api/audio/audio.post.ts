import type { UseMutationOptions } from 'react-query';
import { useMutation } from 'react-query';

import type { AxiosRequestError } from 'src/utils/axiosRequest';
import { axiosRequest } from 'src/utils/axiosRequest';

type POSTResponse = {
  url: string;
};
type POSTParams = {
  sound: Blob;
};

export const createSound = async (data: POSTParams): Promise<POSTResponse> => {
  const bodyFormData = new FormData();
  bodyFormData.append('audio', data.sound);

  const response = await axiosRequest<POSTResponse>({
    method: 'POST',
    url: `/audios`,
    headers: { 'Content-Type': 'multipart/form-data' },
    data: bodyFormData,
  });

  if (response.error) throw response;
  return response.data;
};

export const useCreateSoundMutation = (mutationOpts: Omit<UseMutationOptions<POSTResponse, AxiosRequestError, POSTParams>, 'mutationFn'> = {}) => {
  return useMutation(createSound, {
    ...mutationOpts,
    onSuccess: (data, variables, context) => {
      if (mutationOpts.onSuccess !== undefined) {
        mutationOpts.onSuccess(data, variables, context);
      }
    },
  });
};
const response = await axiosRequest({
  method: 'POST',
  url: '/audios',
  data: formData,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
