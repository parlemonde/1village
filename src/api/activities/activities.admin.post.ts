import { axiosRequest } from 'src/utils/axiosRequest';

export type PostAdminActivityParams = {
  activityParentId: number;
  phase: number;
  villages: number[];
};

export async function postAdminActivity({ activityParentId, phase, villages }: PostAdminActivityParams) {
  const response = await axiosRequest({
    method: 'POST',
    baseURL: '/api',
    url: '/activities/publish',
    data: {
      activityParentId,
      phase,
      villages,
    },
  });
  if (response.error) {
    throw new Error('La publication a échouée');
  }
  return response.data;
}
