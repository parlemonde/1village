import { axiosRequest } from 'src/utils/axiosRequest';

import type { Activity } from 'server/entities/activity';

export async function deleteActivity(id: number): Promise<Activity> {
  return (
    await axiosRequest({
      method: 'DELETE',
      baseURL: '/api',
      url: `/activities/admin/${id}`,
    })
  ).data;
}
