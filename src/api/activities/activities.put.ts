import { useMutation } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';

async function publishActivity(params: { activityId: number }) {
  const { activityId } = params;
  return await axiosRequest({
    method: 'PUT',
    baseURL: '/api',
    url: `/activities/${activityId}`,
    data: {
      status: 0,
    },
  });
}

export const usePublishActivity = (args: { activityId: number }) => {
  const { activityId } = args;
  return useMutation({
    mutationFn: () => {
      return publishActivity({ activityId });
    },
  });
};
