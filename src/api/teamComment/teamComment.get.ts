import { useQuery } from 'react-query';

import { axiosRequest } from 'src/utils/axiosRequest';
import type { TeamCommentInterface } from 'types/teamComment.type';

async function getTeamComments(): Promise<TeamCommentInterface> {
  return (
    await axiosRequest({
      method: 'GET',
      baseURL: '/api',
      url: '/statistics/team-comments',
    })
  ).data;
}

export const useGetSessionsStats = () => {
  return useQuery(['team-comments'], () => getTeamComments());
};
