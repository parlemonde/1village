import type { Activity } from 'server/entities/activity';

import { axiosRequest } from 'src/utils/axiosRequest';

export async function deleteActivity(id: number): Promise<Activity> {
  return (
    await axiosRequest({
      method: 'DELETE',
      baseURL: '/api',
      url: `/activities/admin/${id}`,
    })
  ).data;
}
