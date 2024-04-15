import { useQuery } from 'react-query';
import type { Activity } from 'server/entities/activity';

import { axiosRequest } from 'src/utils/axiosRequest';

async function getActivities(params: { limit: number | null; isPelico: boolean; isDraft: boolean }): Promise<Activity[]> {
  const { limit, isPelico, isDraft } = params;
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/activities',
      params: {
        limit,
        pelico: isPelico,
        status: isDraft ? 1 : 0,
      },
    })
  ).data;
}

export const useGetActivities = (args: { limit: number | null; isPelico: boolean; isDraft: boolean }) => {
  const { isDraft, isPelico, limit } = args;
  return useQuery(['activities', limit, isPelico, isDraft], () => getActivities({ limit, isDraft, isPelico }));
};
