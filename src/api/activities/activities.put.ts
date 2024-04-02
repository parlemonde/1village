import { useMutation, useQueryClient } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';

export async function publishActivity(params: { activityId: number }) {
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
