import { useQuery } from 'react-query';
import type { Activity } from 'server/entities/activity';

import { axiosRequest } from 'src/utils/axiosRequest';

async function getActivitiesAdminDraft(params: { limit: number | null; isDraft: boolean; isDisplayed?: boolean }): Promise<Activity[]> {
  const { limit, isDraft, isDisplayed } = params;
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/activities/admin/draft',
      params: {
        limit,
        status: isDraft ? 1 : 0,
        isDisplayed,
      },
    })
  ).data;
}

export const useGetActivitiesAdminDraft = (args: { limit: number | null; isDraft: boolean; isDisplayed?: boolean }) => {
  const { isDraft, limit, isDisplayed } = args;
  return useQuery(['activities', limit, isDraft, isDisplayed], () => getActivitiesAdminDraft({ limit, isDraft, isDisplayed }));
};
