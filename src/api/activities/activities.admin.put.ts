import { useMutation } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';

async function updateActivityPhase({ activityId, phase }: { activityId: number; phase: number }) {
  return await axiosRequest({
    method: 'PUT',
    baseURL: '/api',
    url: `/activities/admin/${activityId}`,
    data: { phase },
  });
}

export const useUpdateActivityPhase = () => {
  return useMutation(({ activityId, phase }: { activityId: number; phase: number }) => {
    return updateActivityPhase({ activityId, phase });
  });
};
